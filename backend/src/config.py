import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
                              'mysql+pymysql://root:renheng@localhost:3306/chanele_merchant'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'a_very_secret_key_for_chanele_merchant'