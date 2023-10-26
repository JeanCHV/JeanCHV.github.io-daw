
from flask import Flask, render_template, request, redirect, flash, jsonify
from flask import make_response
import controladores.controlador_productos as controlador_productos
import controladores.controlador_usuarios as controlador_usuarios
import controladores.controlador_clientes as controlador_clientes
import clases.clase_producto as clase_producto
import hashlib
import random

app = Flask(__name__)

#Validacion
def validar_token():
    token = request.cookies.get('token')
    username = request.cookies.get('username')
    usuario = controlador_usuarios.obtener_usuario(username)

    if usuario is not None and len(usuario) > 4 and token == usuario[4]:
        return True
    return False

def validar_TipoUsuario():
    username = request.cookies.get('username')
    tipo_usuario = 'administrador'
    usuario = controlador_usuarios.obtener_Tipo_usuario(username)
    if tipo_usuario == usuario[5]:
        return True
    return False

##############
##APIS
##############

#PRODUCTOS
@app.route("/api_obtener_productos")
def api_obtener_productos():
    response=dict()
    datos = []
    productos = controlador_productos.obtener_productos()
    for producto in productos:
        miobjproducto=clase_producto.Producto(producto[0],producto[1],producto[2],producto[3],producto[4])
        datos.append(miobjproducto.obtenerObjetoSerializable())

    #Preparando responde objeto JSON
    response["data"]=datos
    response["code"]=1
    response["message"]="Listado de Productos correcto"
    return jsonify(response)

@app.route("/api_guardar_productos", methods=["POST"])
def api_guardar_producto():
    nombre = request.json["nombre"]
    descripcion = request.json["descripcion"]
    precio = request.json["precio"]
    stock = request.json["stock"]
    controlador_productos.insertar_producto( nombre, descripcion, precio, stock)
    return jsonify({"codigo":"1","mensaje":"Producto guardado correctamente."})

@app.route("/api_actualizar_producto", methods=["POST"])
def api_actualizar_producto():
    nombre = request.json["nombre"]
    descripcion = request.json["descripcion"]
    precio = request.json["precio"]
    stock = request.json["stock"]
    id = request.json["id"]
    controlador_productos.actualizar_producto(nombre, descripcion, precio, stock, id)
    return jsonify({"codigo":"1","mensaje":"Producto actualizado correctamente."})

@app.route("/api_eliminar_producto",methods=["POST"])
def api_eliminar_producto():
    controlador_productos.eliminar_producto (request.json["id"])
    return jsonify({"codigo","1","mensaje","Producto Eliminado correctamente"})


#USUARIOS

@app.route("/api_obtener_usuarios")
def api_obtener_usuarios():
    usuario = controlador_usuarios.obtener_todos_los_usuarios()
    return jsonify(usuario)

@app.route("/api_guardar_usuario", methods=["POST"])
def api_guardar_usuario():
    username = request.json["username"]
    password = request.json["password"]
    email = request.json["email"]
    tipo_usuario=request.json["tipo_usuario"]

    controlador_usuarios.registrar_usuario(username, password, email,tipo_usuario)
    return jsonify({"codigo":"1","mensaje":"Usuario guardado correctamente."})

@app.route("/api_actualizar_usuario", methods=["POST"])
def api_actualizar_usuario():
    username = request.json["username"]
    new_username=request.json["new_username"]
    new_password=request.json["new_password"]
    new_email = request.json["new_email"]
    tipo_usuario=request.json["tipo_usuario"]

    controlador_usuarios.actualizar_usuario(username, new_username, new_password, new_email,tipo_usuario)
    return jsonify({"codigo":"1","mensaje":"Usuario actualizado correctamente."})


#CLIENTES

@app.route("/api_obtener_cliente")
def api_obtener_cliente():
    cliente = controlador_clientes.obtener_todos_los_clientes()
    return jsonify(cliente)

@app.route("/api_guardar_cliente", methods=["POST"])
def api_guardar_cliente():
    nombre = request.json["nombre"]
    email = request.json["email"]
    direccion = request.json["direccion"]
    controlador_clientes.crear_cliente(nombre, email, direccion)
    return jsonify({"codigo":"1","mensaje":"Cliente guardado correctamente."})

@app.route("/api_actualizar_cliente", methods=["POST"])
def api_actualizar_cliente():
    cliente_id = request.json["id"]
    nombre=request.json["nombre"]
    email=request.json["email"]
    direccion = request.json["direccion"]
    controlador_clientes.actualizar_cliente(cliente_id, nombre, email, direccion)
    return jsonify({"codigo":"1","mensaje":"Cliente actualizado correctamente."})

@app.route("/api_eliminar_cliente",methods=["POST"])
def api_eliminar_cliente():
    controlador_clientes.eliminar_cliente (request.json["id"])
    return jsonify({"codigo":"1","mensaje":"Cliente Eliminado correctamente"})
##############


#FUNCIONES PARA LA BD
#############
#PRODUCTO
###########

#CATALOGO PRODUCTOS
@app.route("/productos")
def productos():
    if validar_token():
        productos = controlador_productos.obtener_productos()

        if  validar_TipoUsuario():
            return render_template("productos/productos.index.html", productos=productos, esSesionIniciada=True, esAdministrador=False)
        else:
            return render_template("productos/productos.index.html", productos=productos, esSesionIniciada=True, esAdministrador=True)
    return redirect("/login")

#AGREGAR PRODUCTO
##FUNCION GUARDAR
@app.route("/guardar_producto", methods=["POST"])
def guardar_producto():

    nombre = request.form["nombre"]
    descripcion = request.form["descripcion"]
    precio = request.form["precio"]
    stock = request.form["stock"]

    controlador_productos.insertar_producto(nombre, descripcion, precio, stock)
    # De cualquier modo, y si todo fue bien, redireccionar
    return redirect("/productos")

#FORMULARIO AGREGAR PRODUCTO HTML
@app.route("/agregar_producto")
def formulario_agregar_producto():
    if validar_token():
        return render_template("productos/agregar_producto.html", esSesionIniciada=True,esAdministrador=False)
    return redirect("/login")

#FORMULARIO GUARDAR HTML

#FORMULARIO EDITAR HTML
@app.route("/editar_producto/<int:id>")
def editar_producto(id):
    # Obtener el producto por ID
    productos = controlador_productos.obtener_producto_por_id(id)
    return render_template("productos/editar_producto.html", productos=productos, esSesionIniciada=True,esAdministrador=False)
#MODIFICAR PRODUCTO

#CRUD DE PRODUCTOS
@app.route("/gestionar_producto")
def formulario_crud_producto():
    if validar_token():
        productos = controlador_productos.obtener_productos()
        return render_template("productos/crud_producto.html", productos=productos, esSesionIniciada=True,esAdministrador=False)
    return redirect("/login")

#ELIMINAR PRODUCTO
@app.route("/eliminar_producto", methods=["POST"])
def eliminar_producto():
    controlador_productos.eliminar_producto(request.form["id"])
    return redirect("/productos")

#ACTUALIZAR PRODUCTOS
@app.route("/actualizar_producto", methods=["POST"])
def actualizar_producto():
    id = request.form["id"]
    nombre = request.form["nombre"]
    descripcion = request.form["descripcion"]
    precio = request.form["precio"]
    stock = request.form["stock"]
    controlador_productos.actualizar_producto(nombre, descripcion, precio, stock, id)
    return redirect("/productos")


#FORMULARIO AGREGAR PRODUCTO HTML
@app.route("/agregar_usuario")
def formulario_agregar_usuario():
    if validar_token():
        return render_template("user/agregar_usuario.html", esSesionIniciada=True,esAdministrador=False)
    return redirect("/login")




#CRUD DE USUARIOS
@app.route("/guardar_usuario", methods=["POST"])
def guardar_usuario():

    username = request.form["username"]
    password = request.form["password"]
    email = request.form["email"]
    tipo_usuario = request.form["tipo_usuario"]

    controlador_usuario.registrar_usuario(username, password, email,tipo_usuario)

    # De cualquier modo, y si todo fue bien, redireccionar
    return redirect("/gestionar_usuario")

@app.route("/gestionar_usuario")
def formulario_crud_usuario():
    if validar_token():
        usuarios=controlador_usuarios.obtener_usuarios()

        return render_template("user/crud_usuarios.html", usuarios=usuarios, esSesionIniciada=True,esAdministrador=False)
    return redirect("/login")

#FORMULARIO EDITAR HTML
@app.route("/editar_usuario/<int:id>")
def editar_usuario(id):
    # Obtener el producto por ID
    usuarios=controlador_usuarios.actualizar_usuario( new_username, new_password, new_email,tipo_usuario,username)
    return render_template("user/edit_user.html", usuarios=usuarios, esSesionIniciada=True,esAdministrador=False)

#ELIMINAR USUARIO
@app.route("/eliminar_usuario", methods=["POST"])
def eliminar_usuario():
    controlador_usuarios.eliminar_usuario(request.form["id"])
    return redirect("/gestionar_usuario")



#ACTUALIZAR USUARIO
@app.route("/actualizar_usuario", methods=["POST"])
def actualizar_usuario():

    username = request.form["username"]
    new_username = request.form["new_username"]
    new_password = request.form["new_password"]
    new_email = request.form["email"]
    tipo_usuario = request.form["tipo_usuario"]

    controlador_usuarios.actualizar_usuario( new_username, new_password, new_email,tipo_usuario,username)
    return redirect("/gestionar_usuario")





@app.route("/")
@app.route("/index")
def index():
    if validar_token():
        productos = controlador_productos.obtener_productos()

        if  validar_TipoUsuario():
            return render_template("home.html", productos=productos, esSesionIniciada=True, esAdministrador=False)
        else:
            return render_template("home.html", productos=productos, esSesionIniciada=True, esAdministrador=True)
    return redirect("/login")
    # return render_template("home.html", productos=productos, esSesionIniciada=False)

# @app.route('/home')
# def inicio():
#     return render_template("home.html")


#######################
#1

@app.route("/login")
def login():
    token = request.cookies.get('token')#Obtiene la cookie con nombre token
    if token != 'xyz':#Valida que el valor de la cookie con nombre token tenga dentro 'xyz'
        return render_template("/user/login.html")#Si no tiene el valor rederiza el html
    return redirect("/index")#Si existe el valor 'xyz' en la token redirigirá a '/productos'

@app.route("/registrar_usuario", methods=["GET", "POST"])
def registrar_usuario():
    if request.method == "POST":
        # Obtener los datos del formulario de registro
        username = request.form["username"]
        password = request.form["password"]
        email    =  request.form["email"]

        # Verificar si el nombre de usuario ya existe en la base de datos
        existing_user = controlador_usuarios.obtener_usuario(username)
        if existing_user:
            flash("El nombre de usuario ya está en uso. Por favor, elige otro.")
            return redirect("/registrar_usuario")

        # Calcular el hash SHA-256 de la contraseña
        h = hashlib.new('sha256')
        h.update(bytes(password, encoding="utf-8"))
        encpass = h.hexdigest()

        # Insertar el nuevo usuario en la base de datos
        controlador_usuarios.registrar_usuario(username, encpass,email)

        # Redirigir al usuario a la página de inicio de sesión
        # flash("Registro exitoso. Ahora puedes iniciar sesión.")
        return redirect("/login")

    return render_template("user/register.html")

# Ruta "/procesar_login" que maneja la autenticación del usuario
@app.route("/procesar_login", methods=["POST"])
def procesar_login():
    # Obtener el nombre de usuario y contraseña desde el formulario enviado por el usuario
    username = request.form["username"]
    password = request.form["password"]

    # Obtener la información del usuario a partir del nombre de usuario
    usuario = controlador_usuarios.obtener_usuario(username)

    # Calcular el hash SHA-256 de la contraseña proporcionada por el usuario
    h = hashlib.new('sha256')
    h.update(bytes(password, encoding="utf-8"))
    encpass = h.hexdigest()

    # Comprobar si el hash de la contraseña coincide con el hash almacenado en la base de datos
    if encpass == usuario[2]:
        # La contraseña es correcta, proceder con el inicio de sesión

        # Generar un número aleatorio entre 1 y 1024
        numale = random.randint(1, 1024)

        # Calcular el hash SHA-256 de ese número aleatorio
        a = hashlib.new('sha256')
        a.update(bytes(str(numale), encoding="utf-8"))
        encnumale = a.hexdigest()


        # Crear una respuesta que redirige al usuario a la página "/productos"
        resp = make_response(redirect("/index"))

        # Establecer dos cookies en la respuesta: 'token' y 'username'
        resp.set_cookie('token', encnumale)
        resp.set_cookie('username', username)


        # Actualizar el token del usuario en la base de datos (posiblemente para evitar su reutilización)
        controlador_usuarios.actualizartoken_usuario(username, encnumale)

        return resp  # Redirige al usuario a la página de productos

    # Si las credenciales son incorrectas, redirigir al usuario de nuevo a la página de inicio de sesión
    return redirect("/login")

def procesar_logout():
    resp = make_response(redirect("/index"))
    resp.set_cookie('token', '', 0)
    return resp
app.add_url_rule('/logout', 'procesar_logout', procesar_logout)

# Iniciar el servidor
if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8000, debug=True)