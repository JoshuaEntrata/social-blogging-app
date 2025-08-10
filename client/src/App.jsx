import { BrowserRouter, Routes, Route } from "react-router-dom";

import { CreateArticle, Home, Layout } from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="post" element={<CreateArticle />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
