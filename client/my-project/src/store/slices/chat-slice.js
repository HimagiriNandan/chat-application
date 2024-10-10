export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatData: undefined,
  selectedChatMessages: [],
  directMessagesContacts: [],
  isUploading: false,
  isDownloading: false,
  fileUploadProgress: 0,
  fileDownloadProgress: 0,
  setUploading: (isUploading) => set({isUploading}),
  setDownloading: (isDownloading) => set({isDownloading}),
  setFileUploadProgress: (fileUploadProgress) => set({fileUploadProgress}),
  setFileDownloadProgress: (fileDownloadProgress) => set({fileDownloadProgress}),
  setSelectedChatType: (selectedChatType) => set({selectedChatType}),
  setSelectedChatData: (selectedChatData) => set({selectedChatData}),
  setSelectedChatMessages: (selectedChatMessages) => set({selectedChatMessages}),
  setDirectMessagesContacts: (directMessagesContacts) => set({directMessagesContacts}),
  closeChat: () => 
    set({
      selectedChatType: undefined, 
      selectedChatData: undefined, 
      selectedChatMessages: [],
    }),
  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,{
          ...message,
          recipent: 
            selectedChatType === "channel" 
              ? message.recipent 
              : message.recipent._id,
          sender:
            selectedChatType === "channel" 
              ? message.sender 
              : message.sender._id,
        },
      ]
    })
  }
});