

const getMessages = (request, response) => {
    pool.query(
       "SELECT * FROM messages ORDER BY id DESC LIMIT 10",
       (error, results) => {
          if (error) {
             throw error;
          }
          response.status(200).json(results.rows);
       }
    );
 };
