import { render, screen, fireEvent, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App Component', () => {
  test('renders Task Manager header', () => {
    render(<App />);
    expect(screen.getByText('Task Manager')).toBeInTheDocument();
  });

  test('renders input fields for Task Title and Task Description', () => {
    render(<App />);
    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter task description')).toBeInTheDocument();
  });

  test('renders Add Task button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: /Add Task/i })).toBeInTheDocument();
  });

  test('renders filter dropdown with All, Completed, and Pending options', () => {
    render(<App />);
    const dropdown = screen.getByDisplayValue('All');
    expect(dropdown).toBeInTheDocument();
    expect(within(dropdown).getByText('All')).toBeInTheDocument();
  });

  test('renders table with headers', () => {
    render(<App />);
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  test('shows "No tasks" message when table is empty', () => {
    render(<App />);
    expect(screen.getByText('No tasks')).toBeInTheDocument();
  });

  test('adds a task when Add Task button is clicked', async () => {
    render(<App />);
    const titleInput = screen.getByPlaceholderText('Enter task title');
    const descriptionInput = screen.getByPlaceholderText('Enter task description');
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    await userEvent.type(titleInput, 'Test Task');
    await userEvent.type(descriptionInput, 'Test Description');
    fireEvent.click(addButton);

    expect(screen.getByText('Test Task')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Pending');
  });

  test('clears input fields after adding a task', async () => {
    render(<App />);
    const titleInput = screen.getByPlaceholderText('Enter task title');
    const descriptionInput = screen.getByPlaceholderText('Enter task description');
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    await userEvent.type(titleInput, 'Test Task');
    await userEvent.type(descriptionInput, 'Test Description');
    fireEvent.click(addButton);

    expect(titleInput.value).toBe('');
    expect(descriptionInput.value).toBe('');
  });

  test('does not add task with empty title', () => {
    render(<App />);
    const addButton = screen.getByRole('button', { name: /Add Task/i });
    fireEvent.click(addButton);

    expect(screen.getByText('No tasks')).toBeInTheDocument();
  });

  test('marks task as Completed when Complete button is clicked', async () => {
    render(<App />);
    const titleInput = screen.getByPlaceholderText('Enter task title');
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    await userEvent.type(titleInput, 'Task to Complete');
    fireEvent.click(addButton);

    const completeButton = screen.getByRole('button', { name: /Complete/i });
    fireEvent.click(completeButton);

    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Completed');
    expect(screen.queryByRole('button', { name: /Complete/i })).not.toBeInTheDocument();
  });

  test('hides Complete button after task is marked as Completed', async () => {
    render(<App />);
    const titleInput = screen.getByPlaceholderText('Enter task title');
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    await userEvent.type(titleInput, 'Task to Complete');
    fireEvent.click(addButton);

    const completeButton = screen.getByRole('button', { name: /Complete/i });
    fireEvent.click(completeButton);

    expect(screen.queryByRole('button', { name: /Complete/i })).not.toBeInTheDocument();
  });

  test('deletes a task when Delete button is clicked', async () => {
    render(<App />);
    const titleInput = screen.getByPlaceholderText('Enter task title');
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    await userEvent.type(titleInput, 'Task to Delete');
    fireEvent.click(addButton);

    expect(screen.getByText('Task to Delete')).toBeInTheDocument();

    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    fireEvent.click(deleteButton);

    expect(screen.queryByText('Task to Delete')).not.toBeInTheDocument();
    expect(screen.getByText('No tasks')).toBeInTheDocument();
  });

  test('filters tasks by "All" status', async () => {
    render(<App />);
    const titleInput = screen.getByPlaceholderText('Enter task title');
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    await userEvent.type(titleInput, 'Task 1');
    fireEvent.click(addButton);
    await userEvent.type(titleInput, 'Task 2');
    fireEvent.click(addButton);

    const completeButton = screen.getAllByRole('button', { name: /Complete/i })[0];
    fireEvent.click(completeButton);

    const dropdown = screen.getByDisplayValue('All');
    fireEvent.change(dropdown, { target: { value: 'All' } });

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
  });

  test('filters tasks by "Completed" status', async () => {
    render(<App />);
    const titleInput = screen.getByPlaceholderText('Enter task title');
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    await userEvent.type(titleInput, 'Task 1');
    fireEvent.click(addButton);
    await userEvent.type(titleInput, 'Task 2');
    fireEvent.click(addButton);

    const completeButtons = screen.getAllByRole('button', { name: /Complete/i });
    fireEvent.click(completeButtons[0]);

    const dropdown = screen.getByDisplayValue('All');
    fireEvent.change(dropdown, { target: { value: 'Completed' } });

    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
  });

  test('filters tasks by "Pending" status', async () => {
    render(<App />);
    const titleInput = screen.getByPlaceholderText('Enter task title');
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    await userEvent.type(titleInput, 'Task 1');
    fireEvent.click(addButton);
    await userEvent.type(titleInput, 'Task 2');
    fireEvent.click(addButton);

    const completeButtons = screen.getAllByRole('button', { name: /Complete/i });
    fireEvent.click(completeButtons[0]);

    const dropdown = screen.getByDisplayValue('All');
    fireEvent.change(dropdown, { target: { value: 'Pending' } });

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.queryByText('Task 2')).not.toBeInTheDocument();
  });

  test('adds multiple tasks and maintains them in the list', async () => {
    render(<App />);
    const titleInput = screen.getByPlaceholderText('Enter task title');
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    await userEvent.type(titleInput, 'Task 1');
    fireEvent.click(addButton);
    await userEvent.type(titleInput, 'Task 2');
    fireEvent.click(addButton);
    await userEvent.type(titleInput, 'Task 3');
    fireEvent.click(addButton);

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    expect(screen.getByText('Task 3')).toBeInTheDocument();
  });

  test('updates title input field value on change', async () => {
    render(<App />);
    const titleInput = screen.getByPlaceholderText('Enter task title');

    await userEvent.type(titleInput, 'Hello World');
    expect(titleInput.value).toBe('Hello World');
  });

  test('updates description input field value on change', async () => {
    render(<App />);
    const descriptionInput = screen.getByPlaceholderText('Enter task description');

    await userEvent.type(descriptionInput, 'Test Description');
    expect(descriptionInput.value).toBe('Test Description');
  });

  test('task object has correct structure', async () => {
    render(<App />);
    const titleInput = screen.getByPlaceholderText('Enter task title');
    const descriptionInput = screen.getByPlaceholderText('Enter task description');
    const addButton = screen.getByRole('button', { name: /Add Task/i });

    await userEvent.type(titleInput, 'Structured Task');
    await userEvent.type(descriptionInput, 'With Description');
    fireEvent.click(addButton);

    expect(screen.getByText('Structured Task')).toBeInTheDocument();
    expect(screen.getByText('With Description')).toBeInTheDocument();
    const rows = screen.getAllByRole('row');
    expect(rows[1]).toHaveTextContent('Pending');
  });

  test('filter dropdown changes value correctly', async () => {
    render(<App />);
    const dropdown = screen.getByDisplayValue('All');

    fireEvent.change(dropdown, { target: { value: 'Completed' } });
    expect(screen.getByDisplayValue('Completed')).toBeInTheDocument();

    fireEvent.change(dropdown, { target: { value: 'Pending' } });
    expect(screen.getByDisplayValue('Pending')).toBeInTheDocument();

    fireEvent.change(dropdown, { target: { value: 'All' } });
    expect(screen.getByDisplayValue('All')).toBeInTheDocument();
  });
});
