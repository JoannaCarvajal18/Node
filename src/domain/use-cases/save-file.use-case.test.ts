import fs from 'fs';
import { SaveFile } from './save-file.use-case';



describe('SaveFileUseCase', () => {

  const customOptions = {
    fileContent: 'custom content',
    fileDestination: 'custom-outputs/file-destination',
    fileName: 'test-filename',
  }

  const customFilePath = `${customOptions.fileDestination}/${customOptions.fileName}.txt`;

  beforeEach(() => {
     jest.clearAllMocks();
   });


   afterEach(() => {
    console.log("Verificando si la carpeta 'outputs' existe...");
    const outputFolderExists = fs.existsSync('outputs');
    console.log("¿Existe la carpeta outputs?:", outputFolderExists);
  
    if (outputFolderExists) {
      console.log("Intentando eliminar la carpeta 'outputs'...");
      try {
        fs.rmSync('outputs', { recursive: true });
        console.log("Carpeta eliminada con éxito.");
      } catch (error) {
        console.error("Error al eliminar la carpeta:", error);
      }
    }
  
    console.log("Verificando si la carpeta personalizada existe...");
    const customOutputFolderExists = fs.existsSync(customOptions.fileDestination);
    console.log("¿Existe la carpeta personalizada?:", customOutputFolderExists);
  
    if (customOutputFolderExists) {
      console.log("Intentando eliminar la carpeta personalizada...");
      try {
        fs.rmSync(customOptions.fileDestination, { recursive: true });
        console.log("Carpeta personalizada eliminada con éxito.");
      } catch (error) {
        console.error("Error al eliminar la carpeta personalizada:", error);
      }
    }
  });
  

  test('should save file with default values', () => {

    const saveFile = new SaveFile();
    const filePath = 'outputs/table.txt';
    const options = {
      fileContent: 'test content'
    }

    const result = saveFile.execute(options);
    const fileExists = fs.existsSync(filePath); // ojo
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });
    
    expect( result ).toBe( true );
    expect( fileExists ).toBe( true );
    expect( fileContent ).toBe( options.fileContent );
    

  });


  test('should save file with custom values', () => {

    const saveFile = new SaveFile();
    
    const result = saveFile.execute(customOptions);
    const fileExists = fs.existsSync(customFilePath);
    const fileContent = fs.readFileSync(customFilePath, { encoding: 'utf-8' });
    
    expect( result ).toBe( true );
    expect( fileExists ).toBe( true );
    expect( fileContent ).toBe( customOptions.fileContent );

  });

  test('should return false if directory could not be created', () => {

    const saveFile = new SaveFile();
    const mkdirSpy = jest.spyOn(fs, 'mkdirSync').mockImplementation(
      () => { throw new Error('This is a custom error message from testing'); }
    );
    
    const result = saveFile.execute(customOptions);

    expect( result ).toBe( false );

    mkdirSpy.mockRestore();

  });


  test('should return false if file could not be created', () => {

    const saveFile = new SaveFile();
    const writeFileSpy = jest.spyOn(fs, 'writeFileSync').mockImplementation(
      () => { throw new Error('This is a custom writing error message'); }
    );
    
    const result = saveFile.execute({ fileContent: 'Hola' });

    expect( result ).toBe( false );

    writeFileSpy.mockRestore();
  });



});

