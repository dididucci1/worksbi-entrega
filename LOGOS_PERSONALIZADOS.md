# Logos Personalizados por Usuário

## 📋 Visão Geral

Agora cada usuário pode ter seu próprio logo personalizado! Quando um administrador cria ou edita um usuário, pode escolher qual logo será exibido para aquele usuário específico.

## 🎨 Logos Disponíveis

O sistema já vem com 3 logos pré-configurados:

1. **Logo Padrão (Works BI)** - `logo.png`
2. **Logo Branca** - `logo-branca.png`
3. **Logo Maze** - `logo_maze.png`

## 🔧 Como Usar

### Criando um Novo Usuário com Logo Personalizado

1. Faça login como **administrador**
2. Vá para a seção **Usuários**
3. Clique em **+ Novo Usuário**
4. Preencha os dados do usuário
5. No campo **"Logo"**, selecione o logo desejado
6. Clique em **Criar Usuário**

### Editando o Logo de um Usuário Existente

1. Faça login como **administrador**
2. Vá para a seção **Usuários**
3. Clique no botão **Editar** do usuário desejado
4. Altere o campo **"Logo"** para o logo desejado
5. Clique em **Salvar Alterações**

## 🖼️ Onde o Logo Aparece

O logo personalizado do usuário será exibido em:

- **Dashboard**: No cabeçalho superior esquerdo
- **Home (Admin)**: Na sidebar à esquerda

## ➕ Adicionando Novos Logos

Para adicionar um novo logo ao sistema:

1. **Adicione o arquivo de imagem** na raiz do projeto (ao lado dos outros logos)
   - Exemplo: `logo_empresa.png`

2. **Atualize os formulários** em [home.html](home.html):
   - Procure pelos selects `#editUserLogo` e `#userLogo`
   - Adicione uma nova opção:
   ```html
   <option value="logo_empresa.png">Logo Empresa</option>
   ```

3. **Reinicie o sistema** (não é necessário alterar o banco de dados)

## 💾 Armazenamento no Banco de Dados

**Não é necessário um banco de dados adicional!** 

O logo é armazenado como um campo simples (`logo`) no documento do usuário no MongoDB. Ele guarda apenas o nome do arquivo (ex: `"logo_maze.png"`), não a imagem em si.

### Estrutura no Banco:

```javascript
{
  "_id": "...",
  "name": "João Silva",
  "email": "joao@exemplo.com",
  "logo": "logo_maze.png",  // ← Novo campo!
  "role": "user",
  "dashboards": [...],
  // ... outros campos
}
```

## 🔒 Permissões

- ✅ **Administradores**: Podem selecionar/alterar logos de qualquer usuário
- ❌ **Usuários comuns**: Não têm acesso à edição de logos (apenas visualizam o seu próprio)

## 📝 Observações Técnicas

1. O logo padrão é `logo.png` caso nenhum seja especificado
2. Os arquivos de logo devem estar na raiz do projeto
3. Formatos recomendados: PNG, SVG ou JPEG
4. Tamanho recomendado: máximo 200px de largura para melhor performance

## 🐛 Troubleshooting

**O logo não aparece?**
- Verifique se o arquivo de imagem está na raiz do projeto
- Confirme que o nome do arquivo no banco corresponde ao nome do arquivo físico
- Limpe o cache do navegador (Ctrl + F5)

**Usuários antigos não tem logo?**
- Usuários criados antes desta atualização terão o logo padrão (`logo.png`) automaticamente
- Para alterar, basta editar o usuário e selecionar outro logo

---

✨ **Dica**: Você pode criar logos personalizados para cada cliente ou departamento, deixando a experiência mais personalizada!
