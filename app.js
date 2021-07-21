var app = new Vue({
    el: '#app',
    data: {
        appStarted: false,
        newTask: '',
        tasks: [],
        levelUps: [3, 6, 9, 12, 15, 20] 
    },
    mounted () {
        this.restoreLocalStorage(), this.setStartingTheme();
    },
    computed: {
        score() {
            let score = 0;
            for (let x = 0; x < this.tasks.length; x++) {
                if (this.tasks[x].completed) {
                    score++;
                }
            }
            return score;
        },
        level() {
            let score = this.score;
            let level;
            if (score >= 3 && score < 6) {
                level = 2;
            } else if (score >= 6 && score < 9) {
                level = 3;
            } else if (score >= 9 && score < 12) {
                level = 4;
            } else if (score >= 12 && score < 15) {
                level = 5;
            } else if (score >= 15 && score < 20) {
                level = 6;
            } else if (score >= 20 && score < 30) {
                level = 'MAX';
            } else {
                level = 1;
            }
            return level;
        }
    },
    watch: {
        score(newVal, oldVal) {
            if (newVal > oldVal && this.levelUps.includes(this.score)) {
                this.playSound('level-up-sound');
            }
        },
        tasks() {
            localStorage.tasks = JSON.stringify(this.tasks);
        }
    },
    methods: {
        startApp() {
            this.appStarted = true;
            this.playSound('click-sound');
        },
        endApp() {
            this.appStarted = false;
            this.playSound('minus-sound');
        },
        createNewTask() {
            if (this.newTask.length > 0) {
                this.tasks.push({
                    desc: this.newTask,
                    completed: false
                });
                this.newTask = '';
                this.playSound('click-sound');
            } else {
                alert('Please enter a task first!');
            }
        },
        deleteTask(task) {
            let index = this.tasks.indexOf(task);
            if (index !== -1) {
                this.tasks.splice(index, 1);
                this.playSound('minus-sound');
            }
        },
        toggleCompleted(task) {
            let snd;
            if (!task.completed) {
                task.completed = !task.completed;
                this.playSound('score-sound');
            } else {
                task.completed = !task.completed;
                this.playSound('minus-sound');
             }
             localStorage.tasks = JSON.stringify(this.tasks);
        },
        playSound(id) {
            let snd = document.getElementById(id);
            snd.play();
            snd.currentTime=0;
        },
        toggleTheme() {
            document.body.classList.toggle('dark-theme');
            if (document.body.classList.contains('dark-theme')) {
                localStorage.theme = 'dark-theme';
            } else {
                localStorage.theme = null;
            }
        },
        setStartingTheme() {
            if (localStorage.theme === 'dark-theme') {
                this.toggleTheme();
            }
        },
        restoreLocalStorage() {
            if (localStorage.tasks) {
                this.tasks = JSON.parse(localStorage.tasks);
            }
        }
    }
});