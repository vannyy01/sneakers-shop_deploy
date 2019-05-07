import * as React from 'react';

import Button from '@material-ui/core/Button';
import CardMedia from '@material-ui/core/CardMedia';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import {makeStyles, Theme} from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PollForm from "./PollForm";

const useStyles = makeStyles((theme: Theme) => ({
    backButton: {
        marginRight: theme.spacing(1),
    },
    group: {
        margin: theme.spacing(1, 0),
    },
    instructions: {
        marginBottom: theme.spacing(1),
        marginTop: theme.spacing(1)
    },
    media: {
        height: '300px',
        marginBottom: '0.5em',
        width: '400px'
    },
    root: {
        width: '90%',
    }
}));

export interface QuestionI {
    answerA: string,
    answerB: string,
    answerC: string,
    id: number,
    image: string,
    question: string
}

const questions: QuestionI[] = [
    {
        answerA: "Ціль в верхньому куті і Ви пробиваєте туди, сподіваючись, що м'яч не вилетить.",
        answerB: "Спокійно закатую його на кутовий, сподіваючись, що воротар не пірнає правильно.",
        answerC: "Зупиняюся в середині підбігають, сподіваюся, що воротар пірнає рано, і пробиваю.",
        id: 1,
        image: "https://glavcom.ua/img/article/5682/26_main.jpg",
        question: "Вашій команді присуджено пенальті, і вас обрали виконати його. Що ти зробиш",
    }, {
        answerA: "Уповільнюєтесь і намагаєтесь підібрати партнера по команді в хорошій позиції.",
        answerB: "Спринтуєте вперед і берете на себе захисника, рухаючись убік своєї мети.",
        answerC: "Берете кілька дотиків вперед, потім піднімаєте  м'яч у ворота поза штрафною, оскільки немає жодного захисника.",
        id: 2,
        image: "https://t.resfu.com/media/img_news/screenshot-of-liverpool-counter-attacking-against-west-ham--sporttv.jpg?size=776x&q=60",
        question: "Ваша команда перейшла в контратаку,  3 проти 3. Що б Ви зробили",
    }, {
        answerA: "CS:GO.",
        answerB: "Fortnite.",
        answerC: "FIFA.",
        id: 3,
        image: "https://s3.dexerto.com/thumbnails/_thumbnailLarge/zlatan-ibrahimovic-twitch-fortnite-stream-live-donation-highlight-hilarious-funny-clip-donate.jpg",
        question: "В яку онлайн гру ви граєте",
    },
    {
        answerA: "Ваш товариш по команді відриває вас м'яким пасом, готовим щоб Ви вдарили м’яч у верхній кут.",
        answerB: "Коли ваш товариш по команді пробігає поруч з вами, ви проходите фінтом, а потім спринтом біжите вперед, повз захисника і опиняєтесь перед ціллю.",
        answerC: "Зробити гарну стіночку з вашим товаришем по команді, ви даєте йому досконалий м'яч. Він біжить і пробиває, але воротар рятує, і м'яч прилітає до вас і торкаєтесь його в 2-3 метрах від лінії воріт.",
        id: 4,
        image: "https://s.ill.in.ua/i/news/630x373/330/330409.jpg",
        question: "Яка краща ситуація 2 проти 1 для вас",
    },
    {
        answerA: "Ромелу Лукаку# 9 Манчестер Юнайтед + Бельгія",
        answerB: "Неймар# 10 ПСЖ + Бразилія.",
        answerC: "Давід Сільва # 21 Манчестер Сіті + Іспанія.",
        id: 5,
        image: "https://www.stuttgarter-nachrichten.de/media.media.2af49e65-fdda-4ac2-a28b-e9f45ca21ba9.original1024.jpg",
        question: "Який з цих гравців найкраще підходить вам",
    },
    {
        answerA: "Якщо у мене поганий матч, я викидаю бутси ... Вони дають мені невдачу!",
        answerB: "Ніколи не використовуйте той самий колір, як інший товариш по команді!",
        answerC: "Спочатку зашнуруйте праву ногу, а потім ліву.",
        id: 6,
        image: "https://pokerground.com/en/wp-content/uploads/2016/02/voodoo-doll-superstitions-in-poker.jpg",
        question: "Якщо б у Вас були якісь забобони",
    },
    {
        answerA: "Бігти весь шлях навколо межі центрального кола з розпростореними руками із ревом натовпу у вухах.",
        answerB: "Бігти до кутового прапорця і стояти там, з руками на вухах, а ваші товариші по команді біжать на Вас, щоб відсвяткувати.",
        answerC: "З потужнім гуркотом бігти, а потім стрибати і бити  повітря, і закінчити рукою на клубній емблемі.",
        id: 7,
        image: "http://www.trbimg.com/img-5b422edb/turbine/ct-90mins-fifa-investigating-croatias-pro-ukraine-goal-celebration-20180708",
        question: "Ви забиваєте визначний гол на вашому домашньому стадіоні, а шанувальники дико кричать! Яке Ваше святкування",
    },
    {
        answerA: "Звісно прийшов би.",
        answerB: "Ні, фінал один раз на все життя.",
        answerC: "Провів би весілля на стадіоні.",
        id: 8,
        image: "https://sa.kapamilya.com/absnews/abscbnnews/media/2018/entertainment/06/24/marry-2018-062318.jpg",
        question: "Ви б прийшли на власне весілля, якби в цей ваша улюблена команда вперше вийшла у фінал Ліги Чемпіонів",
    },
    {
        answerA: "Фітнес-тренер.",
        answerB: "Барбер.",
        answerC: "Відкрити власний бізнес.",
        id: 9,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAk_dxAALjUr3rY_6A2k_FHs0blFKjTbE8uAhj49SBliTvN_jG",
        question: "Якби Ви були б футболістом, то яку б професію обрали після закінчення кар’єри",
    },
    {
        answerA: "Проб’єте низом.",
        answerB: "Перекинете воротаря «парашутом».",
        answerC: "Пас на партнера перед пустими воротами.",
        id: 10,
        image: "https://static.standard.co.uk/s3fs-public/thumbnails/image/2018/02/21/20/ucl210218m.jpg?width=1000&height=614&fit=bounds&format=pjpg&auto=webp&quality=70&crop=16:9,offset-y0.5",
        question: "Ви перехопили м’яч у захисника команди суперника і вийшли один на один з воротарем. Як Ви вчините",
    },
];

function HorizontalLabelPositionBelowStepper(props: { onNext: (id: number, answerKey: string) => void, onFinish: () => void }) {
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const [value, setValue] = React.useState();
    document.title = `Пит. ${activeStep}`;
    const {answerA, answerB, answerC, id, image, question} = questions[activeStep];

    function handleNext() {
        setActiveStep(prevActiveStep => prevActiveStep + 1);
        props.onNext(questions[activeStep].id, value);
    }

    function handleBack() {
        setActiveStep(prevActiveStep => prevActiveStep - 1);
    }

    function handleReset() {
        setActiveStep(0);
    }

    function handleChange(event: React.ChangeEvent<unknown>) {
        console.log('value: ' + (event.target as HTMLInputElement).value);
        setValue((event.target as HTMLInputElement).value);
    }

    return (
        <div className={classes.root}>
            <Stepper activeStep={activeStep} alternativeLabel={true}>
                {questions.map(label => (
                    <Step key={label.id}>
                        <StepLabel>{label.question.substring(0, 12)}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            <React.Fragment>
                {activeStep === questions.length ? (
                    <React.Fragment>
                        <Typography className={classes.instructions}>All steps completed</Typography>
                        <Button onClick={handleReset}>Reset</Button>
                    </React.Fragment>
                ) : (
                    <React.Fragment>
                        <Typography className={classes.instructions}>{questions[activeStep].question + '?'}</Typography>
                        <div className="d-flex justify-content-start">
                            <CardMedia
                                image={questions[activeStep].image}
                                className={`${classes.media} rounded`}
                            />
                            <PollForm value={value} handleChange={handleChange} answerA={answerA} answerB={answerB}
                                      answerC={answerC} id={id} image={image}
                                      question={question}/>
                        </div>
                        <React.Fragment>
                            <Button
                                disabled={true}
                                onClick={handleBack}
                                className={classes.backButton}
                            >
                                Back
                            </Button>
                            {activeStep === questions.length - 1 ?
                                <Button variant="contained" color="primary" onClick={props.onFinish}>
                                    Finish
                                </Button> :
                                <Button variant="contained" color="primary" disabled={!value} onClick={handleNext}>
                                    Next
                                </Button>
                            }
                        </React.Fragment>
                    </React.Fragment>
                )}
            </React.Fragment>
        </div>
    );
}

export default HorizontalLabelPositionBelowStepper;