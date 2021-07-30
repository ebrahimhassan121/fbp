
  const findLowestCostNode = (costs, processed) => {
    const knownNodes = Object.keys(costs)
    const lowestCostNode = knownNodes.reduce((lowest, node) => {
        if (lowest === null && !processed.includes(node)) {
          lowest = node;
        }
        if (costs[node] < costs[lowest] && !processed.includes(node)) {
          lowest = node;
        }
        return lowest;
    }, null);
    // console.log("lowestCostNode---",lowestCostNode,knownNodes)
  
    return lowestCostNode
  };
  // function that returns the minimum cost and path to reach Finish

  export const dijkstra = (graph,depature,arraival) => {
    let results = {
      distance: 0,
      path: []
    };
   if(!(graph&&graph[depature]))return results
    const trackedCosts = Object.assign({[arraival]: Infinity}, graph[depature]||{});
    // track paths
    const trackedParents = {[arraival]: null};

    for (let child in graph[depature]) {
      trackedParents[child] = depature;
    }
    // track nodes that have already been processed
    const processedNodes = [];
  
    // Set initial node. Pick lowest cost node.
    let node = findLowestCostNode(trackedCosts, processedNodes);
    // console.log('Initial `node`: ', node)
  
    // console.log('while loop starts: ')
    while (node) {
      let costToReachNode = trackedCosts[node];
      let childrenOfNode = graph[node];
      for (let child in childrenOfNode) {
        let costFromNodetoChild = childrenOfNode[child] 
        let costToChild = costToReachNode + costFromNodetoChild;
        if (!trackedCosts[child] || trackedCosts[child] > costToChild) {
          trackedCosts[child] = costToChild;
          trackedParents[child] = node;
        }
      }
      processedNodes.push(node);
      node = findLowestCostNode(trackedCosts, processedNodes);
    }
    let optimalPath = [arraival];
    let parent = trackedParents?.[arraival];
    while (parent) {
      optimalPath.push(parent);
      parent = trackedParents[parent];
    }
    optimalPath.reverse();
  
     results = {
      distance: trackedCosts[arraival],
      path: optimalPath
    };
  
    return results;
  };