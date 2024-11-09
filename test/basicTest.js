// using sqlite db thease requests are failing
// GET :- ConnectTimeoutError: Connect Timeout Error when >15k, time > 6 sec
// POST :- TypeError: fetch failed  cause: Error: connect EADDRINUSE ::1:3000 >6k , time 4-5 sec

// using a simple object
// POST :- ECONNREFUSED ::1:3000 on >6k requests time 2sec
// GET :- ConnectTimeoutError / code: 'EADDRINUSE', Connect Timeout Error >5k

// on redis using hash ans set
// GET :-  ConnectTimeoutError: Connect Timeout Error 12k+, 40 sec+ and most of them are failing, vs code is also freezing for 2-3 seconds
// POST :- connect EADDRINUSE ::1:3000 failing at 6k+ request time taken ~ 11 sec


// looks like most of the failing is happening due to nodejs only

// withCluster so clustring is clearly gives little bit of improvement 
// POST :- ConnectTimeoutError: Connect Timeout Error 12k+, 20 sec,   code: 'ENOBUFS',
// GET :- 15k+ fail, time 14 sec, code: 'EADDRINUSE'

async function test()
{
    const postUrl = "http://localhost:3000/shorten"
    const requestList = [];

    for(let i=0;i<10000;i++){

        const myData =  `mywebsiteurl${i}.com`
        console.time(`time taken for request ${10000+i*10}`)
        const req = fetch(postUrl,{
            method:"POST",
            body:JSON.stringify({url:myData}),
            headers:{
                "Content-Type":"application/json"
            }
        }).then(res=>{
            console.timeEnd(`time taken for request ${10000+i*10}`)
           return res.json()})
          .then(data=>console.log(data))
          .catch(err=>console.log(err))

        // console.time(`time taken for request ${i}`)
        // const getUrl = `http://localhost:3000/redirect?url=${i}`
        // const req = fetch(getUrl)
        // .then(res=>{
        //     console.timeEnd(`time taken for request ${i}`)
        //     return res.json()}
        // )
        //   .then(data=>console.log(data))
        //   .catch(err=>console.log(err))


        requestList.push(req);
    }
    await Promise.all(requestList);
}

test();
