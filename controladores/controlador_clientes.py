from bd import obtener_conexion

def crear_cliente(nombre, email, direccion):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("INSERT INTO clientes (nombre, email, direccion) VALUES (%s, %s, %s)", (nombre, email, direccion))
    conexion.commit()
    conexion.close()

def obtener_cliente_por_id(cliente_id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id, nombre, email, direccion FROM clientes WHERE id = %s", (cliente_id,))
        cliente = cursor.fetchone()
    conexion.close()
    return cliente

def actualizar_cliente(cliente_id, nombre, email, direccion):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("UPDATE clientes SET nombre = %s, email = %s, direccion = %s WHERE id = %s",
                       (nombre, email, direccion, cliente_id))
    conexion.commit()
    conexion.close()

def eliminar_cliente(cliente_id):
    conexion = obtener_conexion()
    with conexion.cursor() as cursor:
        cursor.execute("DELETE FROM clientes WHERE id = %s", (cliente_id,))
    conexion.commit()
    conexion.close()

def obtener_todos_los_clientes():
    conexion = obtener_conexion()
    clientes = None
    with conexion.cursor() as cursor:
        cursor.execute("SELECT id, nombre, email, direccion FROM clientes")
        clientes = cursor.fetchall()
    conexion.close()
    return clientes
