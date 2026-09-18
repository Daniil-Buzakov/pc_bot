import os
from datetime import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from telegram_init_data import validate, parse
from dotenv import load_dotenv

load_dotenv()

BOT_TOKEN = os.getenv("BOT_TOKEN")
ADMIN_ID = int(os.getenv("ADMIN_ID"))

app = FastAPI(title="PC Shop API")

# CORS для GitHub Pages
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # в продакшене укажи точный URL
    allow_methods=["*"],
    allow_headers=["*"],
)


class OrderRequest(BaseModel):
    initData: str
    pc_id: str
    pc_name: str
    pc_price: int


@app.post("/api/order")
async def create_order(order: OrderRequest):
    # ==== ВАЛИДАЦИЯ ПОДПИСИ TELEGRAM ====
    try:
        validate(order.initData, BOT_TOKEN)
        user_data = parse(order.initData)
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid initData: {e}")

    user = user_data.get("user", {})
    user_id = user.get("id")
    username = user.get("username", "без username")
    first_name = user.get("first_name", "")

    if not user_id:
        raise HTTPException(status_code=400, detail="User not found")

    # ==== ОТПРАВЛЯЕМ УВЕДОМЛЕНИЕ АДМИНУ ====
    from aiogram import Bot
    from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

    bot = Bot(token=BOT_TOKEN)

    # Кнопка для быстрого перехода в чат с пользователем
    user_link = f"tg://user?id={user_id}"
    keyboard = InlineKeyboardMarkup(
        inline_keyboard=[[
            InlineKeyboardButton(text="💬 Написать пользователю", url=user_link)
        ]]
    )

    text = (
        f"🛒 **НОВАЯ ЗАЯВКА!**\n\n"
        f"👤 {first_name} (@{username})\n"
        f"🆔 `{user_id}`\n\n"
        f"🖥 **ПК:** {order.pc_name}\n"
        f"💰 **Цена:** {order.pc_price:,} ₽\n\n"
        f"⏰ {datetime.now().strftime('%H:%M %d.%m.%Y')}"
    )

    try:
        await bot.send_message(
            chat_id=ADMIN_ID,
            text=text,
            reply_markup=keyboard,
            parse_mode="Markdown"
        )
    except Exception as e:
        print(f"Ошибка отправки: {e}")
    finally:
        await bot.session.close()

    return {"status": "ok", "message": "Заявка принята"}


@app.get("/")
async def health():
    return {"status": "alive"}