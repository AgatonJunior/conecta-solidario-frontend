# 💙 Conecta Solidário - Frontend

Aplicação web do **Conecta Solidário**, uma plataforma para gestão de abrigos, voluntários e pessoas em situação de vulnerabilidade em tempo real.

---

## 🌐 Demonstração

🚀 **Acesse o projeto online:**  
👉 https://conecta-solidario-ajuda-org.vercel.app/

---

## 🖼️ Preview do sistema

![Preview do sistema](./preview.png)

> 💡 Interface focada em clareza, rapidez e uso em cenários críticos.

---

## 🎯 Problema que resolve

Em situações emergenciais (enchentes, crises, etc.), a gestão de informações é desorganizada.

O sistema resolve isso ao:

- Centralizar dados de abrigos
- Mostrar vagas disponíveis em tempo real
- Organizar voluntários
- Melhorar a tomada de decisão

---

## 🧠 Funcionalidades

### 🏠 Abrigos
- Listagem de abrigos
- Status (ativo, inativo, urgente)
- Cálculo de ocupação
- Controle de vagas

### 🧑 Voluntários
- Cadastro de voluntários
- Associação com habilidades

### 📊 Interface
- Filtros dinâmicos
- Feedback visual de lotação
- UI responsiva

---

## 🛠️ Tecnologias

- React  
- Vite  
- Axios  
- SCSS Modules  
- Hooks customizados  

---

## ⚙️ Decisões Técnicas

- Separação de lógica com hooks
- Uso de Axios para melhor controle de requisições
- SCSS Modules para isolamento de estilos
- Estrutura escalável e organizada

---

## 🔌 Backend (Produção)

🌐 API online:  
👉 https://api-conecta-solidario-org-ajuda.onrender.com

```env
VITE_API_URL=https://api-conecta-solidario-org-ajuda.onrender.com

git clone https://github.com/AgatonJunior/conecta-solidario-frontend.git
cd conecta-solidario-frontend
npm install
npm run dev