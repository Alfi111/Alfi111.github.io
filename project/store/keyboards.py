from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from aiogram.utils.callback_data import CallbackData

web_app = WebAppInfo(url="https://alfi111.github.io/project/store/index.html")

keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Сайт", web_app=web_app)]
    ],
    resize_keyboard=True
)

cb = CallbackData('btn', 'action')
key = InlineKeyboardMarkup(
    inline_keyboard=[[InlineKeyboardButton('Оплата', callback_data='btn:buy')]]
)
