const validateRequest = (schema) => {
    return (req, res, next) => {
        const result = schema.safeParse({
            body: req.body,
            query: req.query,
            params: req.params
        });

        if (!result.success) {
            const issues = result.error.issues || [];
            const errorMessages = issues.map(err => err.message).join(', ');

            const simplifiedErrors = issues.map(issue => ({
                field: issue.path[issue.path.length - 1],
                message: issue.message
            }));

            return res.status(400).json({
                success: false,
                message: errorMessages,
                errors: simplifiedErrors
            });
        }

        if (result.data.body) req.body = result.data.body;
        if (result.data.query) Object.assign(req.query, result.data.query);
        if (result.data.params) Object.assign(req.params, result.data.params);

        next();
    };
};

export default validateRequest;