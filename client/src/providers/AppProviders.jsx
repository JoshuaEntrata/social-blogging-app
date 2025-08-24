import {
  AuthProvider,
  ProfileProvider,
  ArticleProvider,
  CommentProvider,
  TagProvider,
} from ".";

export const AppProviders = ({ children }) => (
  <AuthProvider>
    <ProfileProvider>
      <ArticleProvider>
        <CommentProvider>
          <TagProvider>{children}</TagProvider>
        </CommentProvider>
      </ArticleProvider>
    </ProfileProvider>
  </AuthProvider>
);
