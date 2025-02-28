const Book = require('./models/Book');
const User = require('./models/User');
const Notification = require('./models/Notification');
const bcrypt = require('bcryptjs');

const sampleBooks = [
  {
    title: "Data Structures and Algorithms",
    author: "Thomas H. Cormen",
    isbn: "978-0262033848",
    category: "Computer Science",
    description: "Comprehensive guide to data structures and algorithms",
    imageUrl:"https://m.media-amazon.com/images/I/61ZYxrQEpCL._SL1400_.jpg",
    totalCopies: 5,
    availableCopies: 5,
    location: {
      shelf: "A1",
      row: "1"
    }
  },
  {
    title: "Introduction to Machine Learning",
    author: "Ethem Alpaydin",
    isbn: "978-0262043793",
    category: "Computer Science",
    description: "Basic concepts and applications of machine learning",
    imageUrl:"https://m.media-amazon.com/images/I/71clLjYtwXL._UF1000,1000_QL80_.jpg",
    totalCopies: 3,
    availableCopies: 3,
    location: {
      shelf: "A2",
      row: "2"
    }
  },
  {
    title: "Digital Electronics",
    author: "William H. Gothmann",
    isbn: "978-0137133963",
    category: "Electronics",
    description: "Fundamentals of digital electronics and circuits",
    imageUrl:"https://m.media-amazon.com/images/I/81YU6vGo7JL._AC_UF1000,1000_QL80_.jpg",
    totalCopies: 4,
    availableCopies: 4,
    location: {
      shelf: "B1",
      row: "1"
    }
  },
  {
    title: "Advanced Engineering Mathematics",
    author: "Erwin Kreyszig",
    isbn: "978-0470458365",
    category: "Mathematics",
    description: "Advanced mathematical concepts for engineering",
    imageUrl:"https://rukminim2.flixcart.com/image/850/1000/xif0q/book/t/s/e/advanced-engineering-mathematics-original-imah7zcxrqy83vrr.jpeg?q=90&crop=false",
    totalCopies: 6,
    availableCopies: 6,
    location: {
      shelf: "C1",
      row: "1"
    }
  },
  {
    title: "Computer Networks",
    author: "Andrew S. Tanenbaum",
    isbn: "978-0132126953",
    category: "Computer Science",
    description: "Comprehensive coverage of computer networking concepts",
    imageUrl:"https://rukminim2.flixcart.com/image/720/864/kjbr8280-0/book/3/0/o/computer-networks-original-imafyx6rawjdugyg.jpeg?q=60&crop=false",
    totalCopies: 3,
    availableCopies: 3,
    location: {
      shelf: "A3",
      row: "1"
    }
  }
];

const sampleUsers = [
  {
    studentId: "2021001",
    name: "John Doe",
    email: "john@vit.ac.in",
    password: "password123",
    role: "student"
  },
  {
    studentId: "2021002",
    name: "Jane Smith",
    email: "jane@vit.ac.in",
    password: "password123",
    role: "student"
  },
  {
    studentId: "ADMIN001",
    name: "Admin User",
    email: "admin@vit.ac.in",
    password: "admin123",
    role: "admin"
  }
];

// Sample notifications
const sampleNotifications = [
  {
    user: "67a253e150e552a5d0872889",
    title: "Book Due Soon",
    message: "The book 'Data Structures and Algorithms' is due in 2 days.",
    type: "DUE_DATE",
    read: false,
    relatedBook: "67a253e050e552a5d0872883"
  }
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Book.deleteMany({});
    await User.deleteMany({});
    await Notification.deleteMany({});

    // Add sample books
    const books = await Book.insertMany(sampleBooks);

    // Add sample users with hashed passwords
    const users = [];
    for (const user of sampleUsers) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      const newUser = await User.create({
        ...user,
        password: hashedPassword
      });
      users.push(newUser);
    }

    // Log users and books to verify they were created
    console.log('Users:', users);
    console.log('Books:', books);

    // Add sample notifications
    const notifications = sampleNotifications.map(notification => {
      const user = users.find(user => user.studentId === notification.user);
      const book = books.find(book => book.title === notification.message.split("'")[1]);

      // Check if user and book are found
      if (!user) {
        console.error(`User not found for studentId: ${notification.user}`);
        return null; // Skip this notification
      }
      if (!book) {
        console.error(`Book not found for title: ${notification.message.split("'")[1]}`);
        return null; // Skip this notification
      }

      return {
        ...notification,
        user: user._id, // Get user ObjectId
        relatedBook: book._id // Get book ObjectId
      };
    }).filter(notification => notification !== null); // Filter out any null notifications

    await Notification.insertMany(notifications);

    console.log('Sample data has been added successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

module.exports = seedDatabase;


