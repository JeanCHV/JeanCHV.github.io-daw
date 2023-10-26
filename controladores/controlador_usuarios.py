import hashlib
import random
from bd import obtener_conexion

def obtener_usuario(username):
    conexion = obtener_conexion()
    usuario = None
    with conexion.cursor() as cursor:
        cursor.execute(
            "SELECT id, username, password, email, token FROM usuarios WHERE username = %s", (username,))
        usuario = cursor.fetchone()
    conexion.close()
    return usuario

def actualizartoken_usuario(username, token):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("UPDATE usuarios SET token = %s WHERE username = %s",
                       (token, username))
    conexion.commit()
    conexion.close()

    ########
def registrar_usuario(username, password, email,tipo_usuario):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("INSERT INTO usuarios (username, password, email,tipo_usuario) VALUES (%s, %s, %s,%s)",
                       (username, password, email))
    conexion.commit()
    conexion.close()

def actualizar_usuario(username, new_username, new_password, new_email,tipo_usuario):
    conexion = obtener_conexion()
    #Encripta la contraseña al momento de actualizar
    h = hashlib.new('sha256')
    h.update(bytes(new_password, encoding="utf-8"))
    new_password = h.hexdigest()

    with conexion.cursor() as cursor:
        cursor.execute("UPDATE usuarios SET username = %s, password = %s, email = %s ,tipo_usuario= %s WHERE username = %s",
                       (new_username, new_password, new_email,tipo_usuario, username))
    conexion.commit()
    conexion.close()


def verificar_credenciales(username, password):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id, username, password FROM usuarios WHERE username = %s", (username,))
        usuario = cursor.fetchone()
        if usuario and usuario['password'] == password:
            return usuario
    conexion.close()
    return None
def obtener_todos_los_usuarios():
    conexion = obtener_conexion()
    usuarios = []
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id, username,email,tipo_usuario FROM usuarios")
        usuarios = cursor.fetchall()
    conexion.close()
    return usuarios


def generar_token():
    # Generar un número aleatorio entre 1 y 1024
    numale = random.randint(1, 1024)

    # Calcular el hash SHA-256 de ese número aleatorio
    a = hashlib.new('sha256')
    a.update(bytes(str(numale), encoding="utf-8"))
    encnumale = a.hexdigest()

    return encnumale

def iniciar_sesion(username, password):
    usuario = verificar_credenciales(username, password)
    if usuario:
        # Generar un nuevo token
        nuevo_token = generar_token()

        # Actualizar el token del usuario en la base de datos
        actualizartoken_usuario(username, nuevo_token)

        return nuevo_token  # Devuelve el nuevo token como resultado de iniciar sesión
    return None  # Devuelve None si las credenciales son incorrectas