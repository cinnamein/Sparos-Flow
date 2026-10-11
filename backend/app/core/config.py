from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_ENV: str = "development"
    APP_SECRET_KEY: str = "change-me-in-production"

    DATABASE_URL: str = "postgresql+asyncpg://flow_user:flow_password@localhost:5432/flow_db"

    JWT_SECRET_KEY: str = "change-me-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    WEATHER_API_KEY: str = ""
    WEATHER_API_URL: str = ""
    TREND_API_KEY: str = ""
    TREND_API_URL: str = ""
    REGION_API_KEY: str = ""
    REGION_API_URL: str = ""

    S3_ENDPOINT_URL: str = ""
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""
    S3_BUCKET_NAME: str = "flow-models"

    LLM_API_KEY: str = ""
    LLM_API_URL: str = ""

    model_config = {"env_file": ".env", "extra": "ignore"}


settings = Settings()
