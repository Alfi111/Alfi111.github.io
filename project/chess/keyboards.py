from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.utils.callback_data import CallbackData

web_app = WebAppInfo(url="https://alfi111.github.io/project/chess/index.html")

keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Play Chess Game", web_app=web_app)]
    ],
    resize_keyboard=True
)
