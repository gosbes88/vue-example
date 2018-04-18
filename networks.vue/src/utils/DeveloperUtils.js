export const ERROR_MESSAGE = (error, text) => {
    if (process.env.NODE_ENV !== 'production') {
        console.error(error);
    } else {
        throw text;
    }
};