export default () => {
  const threadsData = [];
  return new Promise((resolve, reject) => {
    try {
      const threadsNodes = document.querySelectorAll('.thread');
      threadsNodes.forEach(threadNode => {
        const threadData = JSON.parse(threadNode.dataset.contents);
        threadData.element = threadNode;
        threadsData.push(threadData);
      });
      resolve(threadsData);
    } catch (error) {
      reject(error);
    }
  });
};
