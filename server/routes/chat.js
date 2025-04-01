import { Router } from "express";
import dotnet from 'dotenv'
import axios from "axios";
import user from '../helpers/user.js'
import jwt from 'jsonwebtoken'
import chat from "../helpers/chat.js";

dotnet.config()

let router = Router()

const CheckUser = async (req, res, next) => {
    jwt.verify(req.cookies?.userToken, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
        if (decoded) {
            let userData = null

            try {
                userData = await user.checkUserFound(decoded)
            } catch (err) {
                if (err?.notExists) {
                    res.clearCookie('userToken')
                        .status(405).json({
                            status: 405,
                            message: err?.text
                        })
                } else {
                    res.status(500).json({
                        status: 500,
                        message: err
                    })
                }
            } finally {
                if (userData) {
                    req.body.userId = userData._id
                    next()
                }
            }

        } else {
            res.status(405).json({
                status: 405,
                message: 'Not Logged'
            })
        }
    })
}



router.get('/', (req, res) => {
    res.send("Welcome to chatGPT api v1")
})

router.post('/', CheckUser, async (req, res) => {
    const { prompt, userId } = req.body;
  
    let response = {};
    try {
      // Call Claude API
      const apiResponse = await axios.post(
        process.env.CLAUDE_API_URL,
        {
          model: 'claude-3-sonnet-20240229', // Specify the desired model
          max_tokens: 200,
          temperature: 0.7,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'x-api-key': process.env.CLAUDE_API_KEY,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
          },
        }
      );
      
      console.log(apiResponse.data.content[0].text)
      // Extract Claude's response text
      const claudeText = apiResponse?.data?.content[0]?.text?.trim();
  
      if (claudeText) {
        // Remove leading newlines
        response.openai = claudeText.replace(/^\n+/, '');
  
        // Save the response to your database
        response.db = await chat.newResponse(prompt, response.openai, userId);
  
        // Send success response
        res.status(200).json({
          status: 200,
          message: 'Success',
          data: {
            _id: response.db?.chatId,
            content: response.openai,
          },
        });
      } else {
        throw new Error('Claude API returned an empty response.');
      }
    } catch (error) {
      // Log the error for debugging
      console.error('Error calling Claude API:', error);
  
      // Send error response
      res.status(500).json({
        status: 500,
        message: error.message || 'An unexpected error occurred.',
      });
    }
  });

router.put('/', CheckUser, async (req, res) => {
    const { prompt, userId, chatId } = req.body;
  
    let response = {};
  
    try {

      const apiResponse = await axios.post(
        process.env.CLAUDE_API_URL,
        {
          model: 'claude-3-sonnet-20240229', // Specify the desired Claude model
          max_tokens: 200,
          temperature: 0.7,
          messages: [{ role: 'user', content: prompt }],
        },
        {
          headers: {
            'x-api-key': process.env.CLAUDE_API_KEY,
            'Content-Type': 'application/json',
            'anthropic-version': '2023-06-01',
          },
        }
      );
  

      const claudeText = apiResponse?.data?.content[0]?.text?.trim();
  
      if (claudeText) {

        response.openai = claudeText.replace(/^\n+/, '');
  

        response.db = await chat.updateChat(chatId, prompt, response.openai, userId);
  

        res.status(200).json({
          status: 200,
          message: 'Success',
          data: {
            content: response.openai,
          },
        });
      } else {
        throw new Error('Claude API returned an empty response.');
      }
    } catch (err) {

      console.error('Error calling Claude API:', err);
  

      res.status(500).json({
        status: 500,
        message: err.message || 'An unexpected error occurred.',
      });
    }
  });

router.get('/saved', CheckUser, async (req, res) => {
    const { userId } = req.body
    const { chatId = null } = req.query

    let response = null

    try {
        response = await chat.getChat(userId, chatId)
    } catch (err) {
        if (err?.status === 404) {
            res.status(404).json({
                status: 404,
                message: 'Not found'
            })
        } else {
            res.status(500).json({
                status: 500,
                message: err
            })
        }
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success',
                data: response
            })
        }
    }
})

router.get('/history', CheckUser, async (req, res) => {
    const { userId } = req.body

    let response = null

    try {
        response = await chat.getHistory(userId)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: "Success",
                data: response
            })
        }
    }
})

router.delete('/all', CheckUser, async (req, res) => {
    const { userId } = req.body

    let response = null

    try {
        response = await chat.deleteAllChat(userId)
    } catch (err) {
        res.status(500).json({
            status: 500,
            message: err
        })
    } finally {
        if (response) {
            res.status(200).json({
                status: 200,
                message: 'Success'
            })
        }
    }
})

export default router