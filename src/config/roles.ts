const CONFIG_ROLES = {
    ADMINISTRADOR: {
        color: '#d32f2f',
        opciones: [
            { label: 'Listar Usuarios', value: 'usuarios' },
            { label: 'Listar Desarrolladores', value: 'desarrolladores' }
        ]
    },
    GERENTE: {
        color: '#f57c00',
        opciones: [
            { label: 'Listar Proyectos', value: 'proyectos' },
            { label: 'Listar Clientes', value: 'clientes' }
        ]
    },
    CLIENTE: {
        color: '#00a7f5',
        opciones: [
            { label: 'Mis Proyectos', value: 'proyectos' }
        ]
    }
};