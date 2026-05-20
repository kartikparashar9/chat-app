const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(
    process.env.GEMINI_API_KEY
);

const model = genAI.getGenerativeModel({
    model: "gemini-3.1-flash-lite-preview",
});

const AIChat = require("../models/AIChatModel");

// ================= GENERATE AI RESPONSE =================

const generate = async (req, res) => {

    try {

        const { prompt, chatId } = req.body;

        if (!prompt) {
            return res.status(400).json({
                success: false,
                message: "Prompt is required",
            });
        }

        let chat;


        // ================= EXISTING CHAT =================

        if (chatId) {

            chat = await AIChat.findById(chatId);

            if (!chat) {
                return res.status(404).json({
                    success: false,
                    message: "Chat not found",
                });
            }

        }


        // ================= NEW CHAT =================

        else {

            chat = await AIChat.create({
                user: req.user._id,
                messages: [],
            });

        }


        // ================= SAVE USER MESSAGE =================

        chat.messages.push({
            role: "user",
            content: prompt,
        });


        // ================= GEMINI RESPONSE =================

        const result = await model.generateContent(prompt);

        const response = result.response.text();


        // ================= SAVE AI MESSAGE =================

        chat.messages.push({
            role: "assistant",
            content: response,
        });

        await chat.save();


        res.status(200).json({
            success: true,
            chatId: chat._id,
            reply: response,
            messages: chat.messages,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

module.exports = {
    generate,
};