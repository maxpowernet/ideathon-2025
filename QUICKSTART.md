# 🚀 Quick Start Guide

## Iniciar o Projeto

### 1. Instalar Dependências
```powershell
npm install
```

### 2. Iniciar Servidor de Desenvolvimento
```powershell
npm run dev
```

### 3. Acessar no Navegador
- Desktop: `http://localhost:3000`
- Mobile (mesma rede): Use o endereço IP exibido no terminal

---

## 🧪 Testando as Funcionalidades

### Como Comprador (Modo Visitante)
1. Acesse a home - explore o catálogo
2. **Use a busca** - digite "Baru" ou "Pequi" para filtrar
3. Clique em um produto para ver "Saberes do Cerrado"
4. Adicione produtos ao carrinho (toast de confirmação aparecerá)
5. No carrinho, preencha seus dados
6. Clique em "Finalizar e Gerar Contrato"
7. O arquivo DOCX será baixado automaticamente (toast de sucesso)
8. Compartilhe via WhatsApp ou E-mail

### Como Produtor
1. Clique em "Entrar" no header
2. Selecione "Produtor"
3. Faça login com qualquer e-mail (toast de boas-vindas)
4. Clique no botão flutuante amarelo "+" (canto inferior direito)
5. Siga os 4 passos do Quick Capture:
   - Tire uma foto ou selecione da galeria
   - Escolha a categoria
   - Preencha nome, descrição e preço
   - Confirme e publique (toast de sucesso)
6. **Veja seus pedidos**: Clique no card "Pedidos" no dashboard
7. Gerencie status dos pedidos (Aceitar → Em Preparo → Concluído)

### Testando Notificações Toast
As notificações aparecem automaticamente quando você:
- ✅ Adiciona produto ao carrinho
- ✅ Publica um novo produto
- ✅ Faz login com sucesso
- ✅ Gera um contrato
- ✅ Atualiza status de pedido
- ❌ Ocorre algum erro

---

## 📱 Melhor Experiência Mobile

### Chrome DevTools (F12)
1. Abra o DevTools (F12)
2. Toggle Device Toolbar (Ctrl+Shift+M)
3. Selecione um dispositivo móvel (ex: iPhone 12 Pro)
4. Navegue pela aplicação

### Testar em Dispositivo Real
1. Conecte seu smartphone na mesma rede Wi-Fi
2. Execute `npm run dev`
3. No terminal, localize o endereço de rede (ex: `http://192.168.1.x:3000`)
4. Acesse esse endereço no navegador do smartphone

---

## ⚡ Comandos Úteis

```powershell
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview

# Limpar node_modules e reinstalar
Remove-Item -Recurse -Force node_modules
npm install
```

---

## 🎨 Recursos Visuais

### Paleta de Cores (Tailwind)
- `bg-cerrado-green` - Verde Esmeralda
- `bg-cerrado-yellow` - Amarelo Pequi
- `bg-cerrado-earth` - Tom Terra
- `gradient-cerrado` - Gradiente principal

### Classes Úteis
- `btn-primary` - Botão verde principal
- `btn-secondary` - Botão amarelo pequi
- `btn-outline` - Botão com borda
- `card` - Card com sombra suave
- `chip` - Tag/chip de categoria
- `input-field` - Input otimizado para mobile

---

## 🐛 Troubleshooting

### Porta 3000 já está em uso
```powershell
# Use outra porta
npm run dev -- --port 3001
```

### Erros de CSS/Tailwind não aplicando
```powershell
# Limpe o cache e reinicie
Remove-Item -Recurse -Force node_modules/.vite
npm run dev
```

### Imagens não carregam
- Verifique se a URL da imagem é válida
- Para imagens locais, coloque em `/public` e referencie como `/image.jpg`

---

## 📦 Estrutura de Dados

### Produto
```javascript
{
  id: string,
  name: string,
  description: string,
  price: number,
  unit: string, // 'kg', 'unidade', 'litro', etc
  category: string, // 'fruit', 'oil', 'handicraft', etc
  image: string, // URL ou base64
  origin: string, // ex: 'Gurupi/TO'
  producerName: string,
  producerId: string,
  nutritionalInfo: string,
  story: string,
  benefits: string[]
}
```

### Pedido (Order)
```javascript
{
  orderNumber: string, // ex: 'VC-1234567890'
  date: string,
  buyerName: string,
  totalPrice: number,
  itemsCount: number,
  producers: string[]
}
```

---

## 🔥 Funcionalidades Implementadas

✅ Catálogo público responsivo  
✅ **Busca em tempo real por produtos**  
✅ Filtros por categoria  
✅ Modal educativo "Saberes do Cerrado"  
✅ Sistema de carrinho completo  
✅ Geração automática de contratos DOCX  
✅ Compartilhamento mobile nativo  
✅ Quick Capture com câmera  
✅ Painel do produtor  
✅ **Pedidos recebidos para produtores**  
✅ **Gestão de status de pedidos**  
✅ Histórico de pedidos  
✅ Login opcional (modo visitante)  
✅ **Sistema de notificações toast**  
✅ Animações e transições suaves  
✅ Design mobile-first  

---

**Pronto para o Ideathon! 🌿**
