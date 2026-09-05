'use client';

import { useState, type FormEvent } from 'react';
import { ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { demoQuestions } from '@/data/learning';

export default function LearningQuiz() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [confirmed, setConfirmed] = useState(false);
  const complete = step === demoQuestions.length;
  const score = answers.filter((answer, index) => answer === demoQuestions[index].answer).length;
  const question = demoQuestions[step];
  function submit(event: FormEvent) {
    event.preventDefault();
    if (selected === null || confirmed) return;
    setAnswers(previous => [...previous, selected]);
    setConfirmed(true);
  }
  function next() { setStep(value => value + 1); setSelected(null); setConfirmed(false); }
  function reset() { setStep(0); setSelected(null); setAnswers([]); setConfirmed(false); }
  return <div className="learning-quiz" aria-label="Quiz demonstrativo">
    <div className="quiz-heading"><span>QUIZ DEMONSTRATIVO</span><span>{complete ? 'Resultado' : `${step + 1} de ${demoQuestions.length}`}</span></div>
    <progress aria-label="Questões respondidas" value={answers.length} max={demoQuestions.length}/>
    {complete ? <div className="quiz-result" role="status"><CheckCircle2 size={36}/><h3>{score} de {demoQuestions.length} respostas corretas</h3><p>{Math.round(score / demoQuestions.length * 100)}% de aproveitamento nesta demonstração.</p><p>{score === demoQuestions.length ? 'Você concluiu o exemplo. Na plataforma da empresa, os resultados podem compor o acompanhamento individual.' : 'O feedback ajuda a identificar o que revisar e quais conteúdos precisam de reforço.'}</p><button className="action" onClick={reset}><RotateCcw size={18}/> Tentar novamente</button></div> : <form onSubmit={submit}>
      <fieldset disabled={confirmed}><legend>{question.question}</legend><div className="quiz-options">{question.options.map((option, index) => <label key={option} className={confirmed && index === question.answer ? 'is-correct' : confirmed && index === selected ? 'is-incorrect' : ''}><input type="radio" name="quiz-answer" value={index} checked={selected === index} onChange={() => setSelected(index)}/><span>{option}</span></label>)}</div></fieldset>
      {confirmed ? <><div className="quiz-feedback" role="status"><strong>{selected === question.answer ? 'Resposta correta.' : 'Vamos revisar.'}</strong><p>{question.feedback}</p></div><button className="action" type="button" onClick={next}>{step === demoQuestions.length - 1 ? 'Ver resultado' : 'Próxima questão'}<ArrowRight size={18}/></button></> : <button className="action" type="submit" disabled={selected === null}>Conferir resposta<ArrowRight size={18}/></button>}
    </form>}
    <p className="quiz-privacy">Exemplo sem cadastro. As respostas não são enviadas nem armazenadas.</p>
  </div>;
}
