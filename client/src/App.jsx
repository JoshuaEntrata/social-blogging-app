import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  CreateArticle,
  Home,
  Layout,
  Profile,
  Settings,
  Login,
  Register,
  Article,
  EditArticle,
} from "./pages";
import ProtectedRoute from "./routes/ProtectedRoute";
import { AppProviders } from "./providers";

function App() {
  return (
    <BrowserRouter>
      <AppProviders>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />

            {/* Public routes */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="/article/:slug" element={<Article />} />

            {/* Protected routes */}
            <Route
              path="post"
              element={
                <ProtectedRoute>
                  <CreateArticle />
                </ProtectedRoute>
              }
            />
            <Route
              path="/article/:slug/edit"
              element={
                <ProtectedRoute>
                  <EditArticle />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
          </Route>
        </Routes>
      </AppProviders>
    </BrowserRouter>
  );
}

export default App;
