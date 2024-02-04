import App from "./app";

const PORT = process.env.PORT || 3000;

const appInstance = new App();
const app = appInstance.express;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
