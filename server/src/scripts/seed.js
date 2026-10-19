require("dotenv").config();

const bcrypt = require("bcryptjs"),
  connectDB = require("../config/db"),
  User = require("../models/User"),
  Book = require("../models/Book"),
  { loadSampleData } = require("./dataSource");

const seed = async () => {
  await connectDB();
  const authors = loadSampleData();
  const hash = await bcrypt.hash("Author123@", 12);

  let books = 0;

  for (const a of authors) {
    await User.findOneAndUpdate(
      { email: a.email.toLowerCase() },
      {
        $set: {
          name: a.name,
          email: a.email.toLowerCase(),
          password: hash,
          role: "author",
          authorId: a.author_id,
          phone: a.phone,
          city: a.city,
          joinedDate: a.joined_date ? new Date(a.joined_date) : undefined,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    for (const b of a.books || []) {
      await Book.findOneAndUpdate(
        { bookId: b.book_id },
        {
          $set: {
            bookId: b.book_id,
            authorId: a.author_id,
            title: b.title,
            isbn: b.isbn,
            genre: b.genre,
            publicationDate: b.publication_date
              ? new Date(b.publication_date)
              : undefined,
            status: b.status,
            mrp: b.mrp,
            authorRoyaltyPerCopy: b.author_royalty_per_copy,
            totalCopiesSold: b.total_copies_sold,
            totalRoyaltyEarned: b.total_royalty_earned,
            royaltyPaid: b.royalty_paid,
            royaltyPending: b.royalty_pending,
            lastRoyaltyPayoutDate: b.last_royalty_payout_date
              ? new Date(b.last_royalty_payout_date)
              : null,
            printPartner: b.print_partner,
            availableOn: b.available_on || [],
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      books++;
    }
  }

  const email = (process.env.ADMIN_EMAIL || "admin@bookleaf.com").toLowerCase(),
    password = process.env.ADMIN_PASSWORD || "Admin123@",
    adminHash = await bcrypt.hash(password, 12);

  await User.findOneAndUpdate(
    { email },
    {
      $set: {
        name: "Portal Admin",
        email,
        password: adminHash,
        role: "admin",
        authorId: null,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  console.log(`Seed complete: ${authors.length} authors, ${books} books.`);
  console.log(`Author demo: ${authors[0].email} / Author123@`);
  console.log(`Admin demo: ${email} / ${password}`);
  console.log("Change admin credentials before public deployment.");
  process.exit(0);
};

seed().catch((e) => {
  console.error("Seed failed:", e);
  process.exit(1);
});
