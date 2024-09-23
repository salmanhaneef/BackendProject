const asyncHnadler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).then()
        .catch((err)=> next(err));
        
    }

}
export { asyncHnadler}

// const asyncHandler = () => { }
// const asyncHnadler = (func) => () => { }
// const asyncHnadler = (func) => async()=>{}

// const asyncHanler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next);
//     } catch (error) {
//         res.status(err.code || 500).json({
//             success: false,
//             message:err.message
//         })
//     }
// }