// Retorna dashboards do usuário logado
exports.getDashboards = async (req, res) => {
  try {
    // Dados já estão em req.user (do middleware auth com cache)
    // Não precisa consultar banco novamente (OTIMIZAÇÃO)
    
    const { dashboards, role } = req.user;

    if (!dashboards || dashboards.length === 0) {
      return res.json({
        success: true,
        message: 'Nenhum dashboard configurado',
        dashboards: []
      });
    }

    res.json({
      success: true,
      dashboards,
      role
    });

  } catch (error) {
    console.error('Erro ao buscar dashboards:', error);
    res.status(500).json({ message: 'Erro no servidor', error: error.message });
  }
};
