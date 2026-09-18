import asyncio
import os
from aiogram import Bot, Dispatcher
from aiogram.filters import CommandStart
from aiogram.types import (
    Message,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    WebAppInfo,
)
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_ID = int(os.getenv("ADMIN_ID"))
WEBAPP_URL = os.getenv("WEBAPP_URL")

bot = Bot(token=BOT_TOKEN)
dp = Dispatcher()


@dp.message(CommandStart())
async def cmd_start(message: Message):
    # Кнопка открытия WebApp
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[[
            InlineKeyboardButton(
                text="🖥 Открыть каталог ПК",
                web_app=WebAppInfo(url=WEBAPP_URL)
            )
        ]]
    )

    await message.answer(
        "Привет! 👋\n\n"
        "Выбери свой идеальный ПК — открой каталог ниже.\n"
        "Если что-то понравится, я свяжусь с тобой и всё обсудим.",
        reply_markup=keyboard
    )


async def main():
    print("Бот запущен...")
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())