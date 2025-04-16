export const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
    
        reader.onload = () => {
            const base64String = reader.result as string;
            resolve(base64String);
        };
    
        reader.onerror = (error) => {
            reject(error);
        };
    
        reader.readAsDataURL(file); // Read file as Base64 string
    });
};