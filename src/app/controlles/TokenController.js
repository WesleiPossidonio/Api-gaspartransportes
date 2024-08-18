import * as Yup from 'yup';
import axios from 'axios';
import Tokens from '../models/Token'; // Ajuste o caminho para a sua model Token

class TokenController {
  // Rota POST para armazenar um novo token
  async store(request, response) {
    const schema = Yup.object().shape({
      link_token: Yup.string().required()
    });

    try {
      await schema.validateSync(request.body, { abortEarly: false });
    } catch (err) {
      return response.status(400).json({ error: err.errors });
    }

    const { link_token } = request.body;

    await Tokens.create({
      link_token,
    });

    return response.status(201).json({ link_token });
  }

  // Rota GET para verificar e retornar o token e dados adicionais
  async index(request, response) {
    const currentDate = new Date();

    try {
      const existingToken = await Tokens.findOne();

      if (!existingToken) {
        return response.status(404).json({ error: 'Token não encontrado.' });
      }

      const daysSinceLastUpdate = calculateDaysDifference(new Date(existingToken.updatedAt), currentDate);

      if (daysSinceLastUpdate >= 50) {
        try {
          const tokenResponse = await axios.get('https://graph.instagram.com/refresh_access_token', {
            params: {
              grant_type: 'ig_refresh_token',
              access_token: existingToken.link_token,
            },
          });

          const newToken = tokenResponse.data.access_token;
          existingToken.link_token = newToken;
          existingToken.updatedAt = currentDate;
          await existingToken.save();
          
          // Atualiza o token e obtém os dados adicionais
          try {
            const apiResponse = await axios.get('https://graph.instagram.com/me/media', {
              params: {
                fields: 'id,caption,media_type,media_url,thumbnail_url,permalink',
                access_token: newToken,
              },
            });
      
            return response.status(200).json({
              data: apiResponse.data.data
            });
          } catch (error) {
            console.error('Erro ao buscar dados da API do Instagram:', error);
            return response.status(500).json({ error: 'Erro ao buscar dados da API do Instagram.' });
          }
        } catch (error) {
          return response.status(500).json({ error: 'Erro ao renovar o token.' });
        }
      } else {
        // Chamando a api do facebook para buscar o feed do instagram 
        try {
          const apiResponse = await axios.get('https://graph.instagram.com/me/media', {
            params: {
              fields: 'id,caption,media_type,media_url,thumbnail_url,permalink',
              access_token: existingToken.link_token,
            },
          });
    
          return response.status(200).json({
            data: apiResponse.data.data
          });
        } catch (error) {
          console.error('Erro ao buscar dados da API do Instagram:', error);
          return response.status(500).json({ error: 'Erro ao buscar dados da API do Instagram.' });
        }
      
      }
    } catch (error) {
      console.error('Erro ao acessar o token:', error);
      return response.status(500).json({ error: 'Erro ao acessar o token.' });
    }
  }
}

// Função para calcular a diferença em dias entre duas datas
const calculateDaysDifference = (startDate, endDate) => {
  const oneDay = 24 * 60 * 60 * 1000; // Milissegundos em um dia
  return Math.round((endDate.getTime() - startDate.getTime()) / oneDay);
};

export default new TokenController();
