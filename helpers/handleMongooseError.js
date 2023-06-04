const handleMongooseError = (error, data, next) => {
    const { name, code } = error;//щоб вертала статус 409 якщо не уникальний емайл
    const status = (name === "MongoServerError" && code === 11000) ? 409 : 400;
    error.status = status;
    next();
};
module.exports = handleMongooseError;