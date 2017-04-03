import App from '../../app';

export function serverError(err: any = {}) {
    const res = this;
    if (!err.status) {
        err.status = 500;
    }

    if (!err.message) {
        err.message = 'Unknown error';
    }

    console.error(err);
    if (App.get('env') === 'development') {
        return res.status(500).json({
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }

    return res.status(500).json({
        message: err.message,
    });
}
