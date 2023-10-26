from bd import obtener_conexion


def insertar_producto( nombre, descripcion, precio, stock):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("INSERT INTO productos( nombre, descripcion, precio, stock) VALUES (%s, %s, %s, %s)",
                       ( nombre, descripcion, precio, stock))
    conexion.commit()
    conexion.close()


def obtener_productos():
    conexion = obtener_conexion()
    productos = []
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id, nombre, descripcion, precio, stock FROM productos")
        productos = cursor.fetchall()
    conexion.close()
    return productos



def eliminar_producto(id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("DELETE FROM productos WHERE id = %s", (id,))
    conexion.commit()
    conexion.close()


def obtener_producto_por_id(id):
    conexion = obtener_conexion()
    producto = None
    with conexion.cursor() as cursor:
        cursor.execute(
            "SELECT  id,nombre, descripcion, precio, stock FROM productos WHERE id = %s", (id))
        producto = cursor.fetchone()
    conexion.close()
    return producto


def actualizar_producto(nombre, descripcion, precio, stock, id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("UPDATE productos SET nombre = %s, descripcion = %s, precio = %s, stock = %s WHERE id = %s",
                       (nombre, descripcion, precio, stock,id))
    conexion.commit()
    conexion.close()
