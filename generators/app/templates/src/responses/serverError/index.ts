export function serverError(data: any = {}) {
    const res = this;
    return res.status(500).send(data);
}
