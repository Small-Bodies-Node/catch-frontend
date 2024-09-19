declare const xxx = "This is xxx ";
declare function addOne(x: number): string;
declare const workerScript = "\nself.addEventListener('message', function(e) {\n  var data = e.data;\n  console.log('worker recieved: ',data);\n  self.postMessage('worker added! :'+ addOne(data.value));\n}, false);\n";
declare const inlineWorker: (constDependencies: any[] | undefined, functionDependencies: any[] | undefined, scriptString: string, msg: any) => Promise<unknown>;
declare function getVarString(variable: any): string;
