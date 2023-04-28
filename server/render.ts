import { renderPage } from "vite-plugin-ssr/server";

export  const render =async (req, res, next) => {
    const pageContextInit = {
        urlOriginal: req.originalUrl,
    };
    const pageContext = await renderPage(pageContextInit);
    const { httpResponse } = pageContext;
    if (!httpResponse) return next();
    const { statusCode, body } = httpResponse;
    res.status(statusCode).send(body);
}