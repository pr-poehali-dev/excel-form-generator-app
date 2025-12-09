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

export default function Index() {
  const [userInput, setUserInput] = useState('');
  const [generatedFormula, setGeneratedFormula] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState('generator');

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
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 glass-effect mb-8">
            <TabsTrigger value="generator" className="gap-2">
              <Icon name="Sparkles" size={16} />
              Генератор
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