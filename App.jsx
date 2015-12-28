// App component - represents the whole app
App = React.createClass({

    // Lab 1 = hard coded list
    //getTasks() {
    //    return [
    //        { _id: 1, text: "This is task 1" },
    //        { _id: 2, text: "This is task 2" },
    //        { _id: 3, text: "This is task 3" }
    //    ];
    //},
    //
    //renderTasks() {
    //    return this.getTasks().map((task) => {
    //        return <Task key={task._id} task={task} />;
    //    });
    //},

    // TODO: Lab2 - Use database for tasks

    // This mixin makes the getMeteorData method work
    mixins: [ReactMeteorData],

    getInitialState() {
        return {
            hideCompleted: false
        }
    },

    // Loads items from the Tasks collection and puts them on this.data.tasks
    getMeteorData() {
        let query = {};

        if (this.state.hideCompleted) {
            // If hide completed is checked, filter tasks
            query = {checked: {$ne: true}};
        }

        return {
            tasks: Tasks.find(query, {sort: {createdAt: -1}}).fetch(),
            incompleteCount: Tasks.find({checked: {$ne: true}}).count()
        };
    },

    renderTasks() {
        // Get tasks from this.data.tasks
        return this.data.tasks.map((task) => {
            return <Task key={task._id} task={task} />;
        });
    },

    // TODO: Lab3 - enable Add New Task form

    handleSubmit(event) {
        event.preventDefault();

        // Find the text field via the React ref
        var text = React.findDOMNode(this.refs.textInput).value.trim();

        Tasks.insert({
            text: text,
            createdAt: new Date() // current time
        });

        // Clear form
        React.findDOMNode(this.refs.textInput).value = "";
    },

    toggleHideCompleted() {
        this.setState({
            hideCompleted: ! this.state.hideCompleted
        });
    },

    render() {
        return (
            <div className="container">
                <header>
                    <h1>Todo List ({this.data.incompleteCount})</h1>
                    <label className="hide-completed">
                        <input
                            type="checkbox"
                            readOnly={true}
                            checked={this.state.hideCompleted}
                            onClick={this.toggleHideCompleted} />
                        Hide Completed Tasks
                    </label>
                </header>

                <ul>
                    {this.renderTasks()}
                </ul>
            </div>
        );
    }
});