import {
  AuthContextProvider,
  ColorContextProvider,
  ImageSelectorContextProvider,
  TextEditorContextProvider,
} from "./index";

const GlobalContextProvider = ({ children }) => {
  return (
    <AuthContextProvider>
      <ColorContextProvider>
        <TextEditorContextProvider>
          <ImageSelectorContextProvider>{children}</ImageSelectorContextProvider>
        </TextEditorContextProvider>
      </ColorContextProvider>
    </AuthContextProvider>
  );
};

export default GlobalContextProvider;
