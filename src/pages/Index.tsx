import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const excelFormulas = [
  {
    category: 'Математика',
    formulas: [
      {
        name: 'СУММ',
        syntax: '=СУММ(число1; число2; ...)',
        description: 'Суммирует все числа в диапазоне ячеек',
        example: '=СУММ(A1:A10)'
      },
      {
        name: 'СРЗНАЧ',
        syntax: '=СРЗНАЧ(число1; число2; ...)',
        description: 'Вычисляет среднее арифметическое',
        example: '=СРЗНАЧ(B1:B20)'
      },
      {
        name: 'МАКС',
        syntax: '=МАКС(число1; число2; ...)',
        description: 'Возвращает максимальное значение',
        example: '=МАКС(C1:C50)'
      },
      {
        name: 'МИН',
        syntax: '=МИН(число1; число2; ...)',
        description: 'Возвращает минимальное значение',
        example: '=МИН(D1:D30)'
      }
    ]
  },
  {
    category: 'Логика',
    formulas: [
      {
        name: 'ЕСЛИ',
        syntax: '=ЕСЛИ(условие; значение_если_истина; значение_если_ложь)',
        description: 'Проверяет условие и возвращает одно из двух значений',
        example: '=ЕСЛИ(A1>100; "Много"; "Мало")'
      },
      {
        name: 'И',
        syntax: '=И(условие1; условие2; ...)',
        description: 'Возвращает ИСТИНА если все условия истинны',
        example: '=И(A1>0; B1<100)'
      },
      {
        name: 'ИЛИ',
        syntax: '=ИЛИ(условие1; условие2; ...)',
        description: 'Возвращает ИСТИНА если хотя бы одно условие истинно',
        example: '=ИЛИ(A1="Да"; B1="Да")'
      }
    ]
  },
  {
    category: 'Текст',
    formulas: [
      {
        name: 'СЦЕПИТЬ',
        syntax: '=СЦЕПИТЬ(текст1; текст2; ...)',
        description: 'Объединяет несколько текстовых строк в одну',
        example: '=СЦЕПИТЬ(A1; " "; B1)'
      },
      {
        name: 'ЛЕВСИМВ',
        syntax: '=ЛЕВСИМВ(текст; количество_знаков)',
        description: 'Возвращает указанное количество символов слева',
        example: '=ЛЕВСИМВ(A1; 5)'
      },
      {
        name: 'ПРОПИСН',
        syntax: '=ПРОПИСН(текст)',
        description: 'Преобразует текст в верхний регистр',
        example: '=ПРОПИСН(A1)'
      }
    ]
  },
  {
    category: 'Поиск',
    formulas: [
      {
        name: 'ВПР',
        syntax: '=ВПР(искомое_значение; таблица; номер_столбца; [интервальный_просмотр])',
        description: 'Ищет значение в первом столбце и возвращает значение из указанного столбца',
        example: '=ВПР(A1; B1:D10; 3; ЛОЖЬ)'
      },
      {
        name: 'ГПР',
        syntax: '=ГПР(искомое_значение; таблица; номер_строки; [интервальный_просмотр])',
        description: 'Горизонтальный поиск значения в таблице',
        example: '=ГПР("Продажи"; A1:F5; 2; ЛОЖЬ)'
      }
    ]
  }
];

const suggestedPrompts = [
  'Посчитать сумму продаж за месяц',
  'Найти среднюю оценку студентов',
  'Проверить, превышает ли значение лимит',
  'Объединить имя и фамилию',
  'Найти максимальное значение в диапазоне'
];

const macroTemplates = [
  {
    category: 'Форматирование',
    macros: [
      {
        name: 'Автоширина столбцов',
        description: 'Автоматически подбирает ширину всех столбцов',
        code: `Sub AutoFitColumns()
    Cells.Select
    Selection.Columns.AutoFit
    Range("A1").Select
End Sub`
      },
      {
        name: 'Цветная подсветка строк',
        description: 'Раскрашивает строки через одну',
        code: `Sub ColorAlternateRows()
    Dim i As Long
    For i = 2 To Cells(Rows.Count, 1).End(xlUp).Row
        If i Mod 2 = 0 Then
            Rows(i).Interior.Color = RGB(240, 240, 240)
        End If
    Next i
End Sub`
      }
    ]
  },
  {
    category: 'Обработка данных',
    macros: [
      {
        name: 'Удалить пустые строки',
        description: 'Удаляет все пустые строки в таблице',
        code: `Sub DeleteEmptyRows()
    Dim i As Long
    For i = Cells(Rows.Count, 1).End(xlUp).Row To 1 Step -1
        If WorksheetFunction.CountA(Rows(i)) = 0 Then
            Rows(i).Delete
        End If
    Next i
End Sub`
      },
      {
        name: 'Сортировка по столбцу A',
        description: 'Сортирует данные по первому столбцу',
        code: `Sub SortByColumnA()
    Dim lastRow As Long
    lastRow = Cells(Rows.Count, 1).End(xlUp).Row
    Range("A1:Z" & lastRow).Sort Key1:=Range("A1"), _
        Order1:=xlAscending, Header:=xlYes
End Sub`
      }
    ]
  },
  {
    category: 'Экспорт',
    macros: [
      {
        name: 'Сохранить как PDF',
        description: 'Сохраняет активный лист в PDF',
        code: `Sub ExportToPDF()
    Dim fileName As String
    fileName = ThisWorkbook.Path & "\\" & ActiveSheet.Name & ".pdf"
    ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, _
        fileName:=fileName, Quality:=xlQualityStandard
    MsgBox "Файл сохранён: " & fileName
End Sub`
      },
      {
        name: 'Экспорт в CSV',
        description: 'Сохраняет активный лист как CSV файл',
        code: `Sub ExportToCSV()
    Dim fileName As String
    fileName = ThisWorkbook.Path & "\\" & ActiveSheet.Name & ".csv"
    ActiveSheet.SaveAs fileName:=fileName, FileFormat:=xlCSV
    MsgBox "Файл сохранён: " & fileName
End Sub`
      }
    ]
  }
];

const macroPrompts = [
  'Удалить все пустые строки',
  'Автоматически подогнать ширину столбцов',
  'Раскрасить строки через одну',
  'Сохранить таблицу в PDF',
  'Найти и заменить текст во всех ячейках'
];

export default function Index() {
  const [userInput, setUserInput] = useState('');
  const [generatedFormula, setGeneratedFormula] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');
  const [macroInput, setMacroInput] = useState('');
  const [generatedMacro, setGeneratedMacro] = useState('');
  const [isGeneratingMacro, setIsGeneratingMacro] = useState(false);

  const generateFormula = () => {
    setIsGenerating(true);
    
    setTimeout(() => {
      const lowerInput = userInput.toLowerCase();
      let formula = '';
      
      if (lowerInput.includes('сумм') || lowerInput.includes('посчитать')) {
        formula = '=СУММ(A1:A10)';
      } else if (lowerInput.includes('средн') || lowerInput.includes('средняя')) {
        formula = '=СРЗНАЧ(A1:A10)';
      } else if (lowerInput.includes('макс') || lowerInput.includes('максимальн')) {
        formula = '=МАКС(A1:A10)';
      } else if (lowerInput.includes('мин') || lowerInput.includes('минимальн')) {
        formula = '=МИН(A1:A10)';
      } else if (lowerInput.includes('если') || lowerInput.includes('условие') || lowerInput.includes('проверить')) {
        formula = '=ЕСЛИ(A1>100; "Превышает"; "Норма")';
      } else if (lowerInput.includes('объедин') || lowerInput.includes('сцепить')) {
        formula = '=СЦЕПИТЬ(A1; " "; B1)';
      } else if (lowerInput.includes('поиск') || lowerInput.includes('найти значение')) {
        formula = '=ВПР(A1; B1:D10; 2; ЛОЖЬ)';
      } else {
        formula = '=СУММ(A1:A10)';
      }
      
      setGeneratedFormula(formula);
      setIsGenerating(false);
    }, 1500);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedFormula);
  };

  const generateMacro = () => {
    setIsGeneratingMacro(true);
    
    setTimeout(() => {
      const lowerInput = macroInput.toLowerCase();
      let macro = '';
      
      if (lowerInput.includes('пустые строки') || lowerInput.includes('удалить строки')) {
        macro = `Sub DeleteEmptyRows()
    Dim i As Long
    For i = Cells(Rows.Count, 1).End(xlUp).Row To 1 Step -1
        If WorksheetFunction.CountA(Rows(i)) = 0 Then
            Rows(i).Delete
        End If
    Next i
End Sub`;
      } else if (lowerInput.includes('ширин') || lowerInput.includes('автоширина') || lowerInput.includes('подогнать')) {
        macro = `Sub AutoFitColumns()
    Cells.Select
    Selection.Columns.AutoFit
    Range("A1").Select
End Sub`;
      } else if (lowerInput.includes('раскрас') || lowerInput.includes('цвет') || lowerInput.includes('через одну')) {
        macro = `Sub ColorAlternateRows()
    Dim i As Long
    For i = 2 To Cells(Rows.Count, 1).End(xlUp).Row
        If i Mod 2 = 0 Then
            Rows(i).Interior.Color = RGB(240, 240, 240)
        End If
    Next i
End Sub`;
      } else if (lowerInput.includes('pdf') || lowerInput.includes('пдф')) {
        macro = `Sub ExportToPDF()
    Dim fileName As String
    fileName = ThisWorkbook.Path & "\\" & ActiveSheet.Name & ".pdf"
    ActiveSheet.ExportAsFixedFormat Type:=xlTypePDF, _
        fileName:=fileName, Quality:=xlQualityStandard
    MsgBox "Файл сохранён: " & fileName
End Sub`;
      } else if (lowerInput.includes('найти') && lowerInput.includes('заменить')) {
        macro = `Sub FindAndReplace()
    Dim findText As String
    Dim replaceText As String
    findText = InputBox("Что найти?")
    replaceText = InputBox("На что заменить?")
    Cells.Replace What:=findText, Replacement:=replaceText, _
        LookAt:=xlPart, MatchCase:=False
    MsgBox "Замена выполнена!"
End Sub`;
      } else if (lowerInput.includes('сортир')) {
        macro = `Sub SortByColumnA()
    Dim lastRow As Long
    lastRow = Cells(Rows.Count, 1).End(xlUp).Row
    Range("A1:Z" & lastRow).Sort Key1:=Range("A1"), _
        Order1:=xlAscending, Header:=xlYes
End Sub`;
      } else {
        macro = `Sub AutoFitColumns()
    Cells.Select
    Selection.Columns.AutoFit
    Range("A1").Select
End Sub`;
      }
      
      setGeneratedMacro(macro);
      setIsGeneratingMacro(false);
    }, 1500);
  };

  const copyMacroToClipboard = () => {
    navigator.clipboard.writeText(generatedMacro);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="text-center mb-12 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl gradient-primary animate-glow">
              <Icon name="Calculator" size={32} className="text-white" />
            </div>
            <h1 className="text-5xl font-bold text-gradient">Excel Formula AI</h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Генератор формул Excel с помощью искусственного интеллекта
          </p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 glass-effect mb-8">
            <TabsTrigger value="generator" className="gap-2">
              <Icon name="Sparkles" size={16} />
              Формулы
            </TabsTrigger>
            <TabsTrigger value="macros" className="gap-2">
              <Icon name="Code2" size={16} />
              Макросы
            </TabsTrigger>
            <TabsTrigger value="reference" className="gap-2">
              <Icon name="BookOpen" size={16} />
              Справочник
            </TabsTrigger>
            <TabsTrigger value="profile" className="gap-2">
              <Icon name="User" size={16} />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generator" className="animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="glass-effect border-primary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="MessageSquare" size={20} />
                    Опишите задачу
                  </CardTitle>
                  <CardDescription>
                    Расскажите, что нужно сделать, и мы создадим формулу
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Например: посчитать сумму продаж за месяц..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    className="min-h-[120px] glass-effect resize-none"
                  />
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Попробуйте:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestedPrompts.map((prompt, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="cursor-pointer hover:bg-primary/20 transition-colors"
                          onClick={() => setUserInput(prompt)}
                        >
                          {prompt}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={generateFormula}
                    disabled={!userInput || isGenerating}
                    className="w-full gradient-primary hover:opacity-90 transition-opacity"
                    size="lg"
                  >
                    {isGenerating ? (
                      <>
                        <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                        Генерирую...
                      </>
                    ) : (
                      <>
                        <Icon name="Wand2" size={20} className="mr-2" />
                        Сгенерировать формулу
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-effect border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Code" size={20} />
                    Результат
                  </CardTitle>
                  <CardDescription>
                    Ваша готовая формула для Excel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedFormula ? (
                    <>
                      <div className="p-6 rounded-lg bg-muted/50 border border-accent/30 animate-scale-in">
                        <code className="text-2xl font-mono text-accent font-bold">
                          {generatedFormula}
                        </code>
                      </div>
                      
                      <Button
                        onClick={copyToClipboard}
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        <Icon name="Copy" size={20} className="mr-2" />
                        Скопировать формулу
                      </Button>

                      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                        <div className="flex items-start gap-3">
                          <Icon name="Lightbulb" size={20} className="text-accent mt-0.5 flex-shrink-0" />
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Как использовать:</p>
                            <p className="text-sm text-muted-foreground">
                              Скопируйте формулу и вставьте в любую ячейку Excel. 
                              Измените диапазоны ячеек под ваши данные.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="p-4 rounded-full bg-muted/50 mb-4">
                        <Icon name="FileSpreadsheet" size={48} className="text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        Формула появится здесь после генерации
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="macros" className="animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <Card className="glass-effect border-secondary/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Terminal" size={20} />
                    Опишите задачу для макроса
                  </CardTitle>
                  <CardDescription>
                    Расскажите, что нужно автоматизировать в Excel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Например: удалить все пустые строки..."
                    value={macroInput}
                    onChange={(e) => setMacroInput(e.target.value)}
                    className="min-h-[120px] glass-effect resize-none"
                  />
                  
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Популярные макросы:</p>
                    <div className="flex flex-wrap gap-2">
                      {macroPrompts.map((prompt, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="cursor-pointer hover:bg-secondary/40 transition-colors"
                          onClick={() => setMacroInput(prompt)}
                        >
                          {prompt}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={generateMacro}
                    disabled={!macroInput || isGeneratingMacro}
                    className="w-full gradient-accent hover:opacity-90 transition-opacity"
                    size="lg"
                  >
                    {isGeneratingMacro ? (
                      <>
                        <Icon name="Loader2" size={20} className="animate-spin mr-2" />
                        Генерирую макрос...
                      </>
                    ) : (
                      <>
                        <Icon name="Code2" size={20} className="mr-2" />
                        Сгенерировать макрос
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>

              <Card className="glass-effect border-accent/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="FileCode" size={20} />
                    Код макроса VBA
                  </CardTitle>
                  <CardDescription>
                    Готовый код для встраивания в Excel
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {generatedMacro ? (
                    <>
                      <div className="p-4 rounded-lg bg-muted/50 border border-accent/30 animate-scale-in overflow-x-auto">
                        <pre className="text-sm font-mono text-accent">
                          <code>{generatedMacro}</code>
                        </pre>
                      </div>
                      
                      <Button
                        onClick={copyMacroToClipboard}
                        variant="outline"
                        className="w-full"
                        size="lg"
                      >
                        <Icon name="Copy" size={20} className="mr-2" />
                        Скопировать код
                      </Button>

                      <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
                        <div className="flex items-start gap-3">
                          <Icon name="Info" size={20} className="text-accent mt-0.5 flex-shrink-0" />
                          <div className="space-y-2">
                            <p className="text-sm font-medium">Как установить макрос:</p>
                            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                              <li>Откройте Excel, нажмите Alt+F11</li>
                              <li>Вставка → Модуль</li>
                              <li>Вставьте скопированный код</li>
                              <li>Запустите через Alt+F8</li>
                            </ol>
                          </div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <div className="p-4 rounded-full bg-muted/50 mb-4">
                        <Icon name="Code" size={48} className="text-muted-foreground" />
                      </div>
                      <p className="text-muted-foreground">
                        Макрос появится здесь после генерации
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Package" size={24} />
                  Библиотека готовых макросов
                </CardTitle>
                <CardDescription>
                  Выберите готовый макрос и скопируйте код
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {macroTemplates.map((category, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-px flex-1 bg-gradient-to-r from-secondary to-transparent" />
                        <h3 className="text-lg font-semibold text-gradient">{category.category}</h3>
                        <div className="h-px flex-1 bg-gradient-to-l from-secondary to-transparent" />
                      </div>
                      
                      <Accordion type="single" collapsible className="space-y-2">
                        {category.macros.map((macro, midx) => (
                          <AccordionItem
                            key={midx}
                            value={`macro-${idx}-${midx}`}
                            className="glass-effect border border-white/5 rounded-lg px-4"
                          >
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="bg-secondary/20">
                                  {macro.name}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {macro.description}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-3">
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-xs text-muted-foreground">Код VBA:</p>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => navigator.clipboard.writeText(macro.code)}
                                  >
                                    <Icon name="Copy" size={14} className="mr-1" />
                                    Копировать
                                  </Button>
                                </div>
                                <pre className="text-sm bg-muted/50 p-3 rounded overflow-x-auto">
                                  <code className="text-accent">{macro.code}</code>
                                </pre>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reference" className="animate-fade-in">
            <Card className="glass-effect">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Library" size={24} />
                  Справочник формул Excel
                </CardTitle>
                <CardDescription>
                  Полный список формул с примерами и описанием синтаксиса
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {excelFormulas.map((category, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="h-px flex-1 bg-gradient-to-r from-primary to-transparent" />
                        <h3 className="text-lg font-semibold text-gradient">{category.category}</h3>
                        <div className="h-px flex-1 bg-gradient-to-l from-primary to-transparent" />
                      </div>
                      
                      <Accordion type="single" collapsible className="space-y-2">
                        {category.formulas.map((formula, fidx) => (
                          <AccordionItem
                            key={fidx}
                            value={`${idx}-${fidx}`}
                            className="glass-effect border border-white/5 rounded-lg px-4"
                          >
                            <AccordionTrigger className="hover:no-underline">
                              <div className="flex items-center gap-3">
                                <Badge variant="outline" className="font-mono">
                                  {formula.name}
                                </Badge>
                                <span className="text-sm text-muted-foreground">
                                  {formula.description}
                                </span>
                              </div>
                            </AccordionTrigger>
                            <AccordionContent className="space-y-3 pt-3">
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Синтаксис:</p>
                                <code className="text-sm bg-muted/50 px-3 py-2 rounded block">
                                  {formula.syntax}
                                </code>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground mb-1">Пример:</p>
                                <code className="text-sm bg-accent/10 text-accent px-3 py-2 rounded block font-semibold">
                                  {formula.example}
                                </code>
                              </div>
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="animate-fade-in">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="User" size={20} />
                    Профиль
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-20 rounded-full gradient-primary flex items-center justify-center">
                      <Icon name="User" size={40} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">Excel Пользователь</h3>
                      <p className="text-sm text-muted-foreground">Начинающий</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3 pt-4">
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm">Формул создано</span>
                      <Badge variant="secondary">0</Badge>
                    </div>
                    <div className="flex justify-between items-center p-3 rounded-lg bg-muted/30">
                      <span className="text-sm">Сохранено</span>
                      <Badge variant="secondary">0</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="glass-effect">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="History" size={20} />
                    История
                  </CardTitle>
                  <CardDescription>
                    Последние созданные формулы
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-4 rounded-full bg-muted/50 mb-4">
                      <Icon name="FileText" size={40} className="text-muted-foreground" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      История формул пока пуста
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Создайте первую формулу на вкладке "Генератор"
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}