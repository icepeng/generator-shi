export function <%= responseName %>(data: any = {}) {
    const res = this;
    return res.status(<%= statusCode %>).send(data);
}
