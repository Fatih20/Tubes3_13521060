# Chatbot Project

- [Chatbot Project](#chatbot-project)
  - [Project Description](#project-description)
  - [Program Features](#program-features)
  - [Algorithm Description](#algorithm-description)
    - [KMP Algorithm](#kmp-algorithm)
    - [BM Algorithm](#bm-algorithm)
  - [Running the Program](#running-the-program)
    - [Local](#local)
    - [Website](#website)
  - [Libraries Used](#libraries-used)

## Project Description

This project is a web-based ChatBot project, inspired by the trending AI ChatBot, ChatGPT (but is not GPT-based), created using the nextJS and prisma framework and implements the KMP and BM string matching algorithm to match the message input with the stored question-answer in the database, made as a project for the Algorithm and Strategies course Bandung Institute of Technology. Made by Fatih N.R.I (13521060), Kenneth Ezekiel (13521089), Muhammad Aji W. (13521095).

## Program Features

Our program features:

- Calculator for mathematical expression
- Date Calendar
- Asking questions
- Adding questions-answers to the database
- Removing questions from the database
- Account Login
- Chat Sessions

## Algorithm Description

### KMP Algorithm

The Knuth-Morris-Pratt (KMP) algorithm is a string-matching algorithm that is used to search for a pattern (substring) within a text (string) in linear time. It was developed by Donald Knuth, Vaughan Pratt, and James Morris in 1977.

The algorithm works by pre-processing the pattern to create an auxiliary array called the failure function or partial match table. The failure function tells the algorithm where to resume the search after a mismatch occurs between the pattern and the text.

The algorithm works by:

1. Pre-processing: Build the failure function array for the pattern. The failure function is an array that contains the length of the longest proper prefix of the pattern that is also a suffix of that prefix. To build the failure function, start by initializing the first element to 0 and then use a loop to iterate over the pattern, comparing each character to the previous character. If the characters match, set the failure function value for that position to the value of the previous position plus one. If they don't match, backtrack to the previous character and use its failure function value to continue the comparison.

2. Searching: Once the failure function has been created, use it to search for the pattern within the text. Start at the beginning of the text and the pattern and compare each character. If the characters match, continue to the next character in the pattern and the text. If they don't match, use the failure function to determine where to resume the search in the pattern. The algorithm uses the value stored in the failure function for the current position in the pattern as the index for the next comparison. Continue this process until the end of the text is reached or a match is found.

The KMP algorithm is particularly useful when the pattern being searched for is large, as it can avoid repeated comparisons of characters that have already been matched. It also has a worst-case time complexity of O(m+n), where m is the length of the pattern and n is the length of the text.

### BM Algorithm

The Boyer-Moore (BM) algorithm is a string matching algorithm that searches for occurrences of a pattern within a larger string. It was developed by Robert S. Boyer and J Strother Moore in 1977.

The BM algorithm is based on two main ideas: the "bad character" rule and the "good suffix" rule. The bad character rule allows the algorithm to skip over characters in the input string that have already been matched and are not part of the pattern, while the good suffix rule allows the algorithm to shift the pattern forward to align with a previously matched suffix.

The algorithm works as follows:

1. Preprocess the pattern string: The algorithm constructs two tables, the "bad character" table and the "good suffix" table, based on the pattern string.

2. Search the input string: The algorithm starts by aligning the pattern with the end of the input string. It then compares the pattern characters to the input string characters, starting from the end of the pattern and working backwards. If a mismatch occurs, the algorithm uses the bad character rule to determine how far to shift the pattern to the right. If a match occurs, the algorithm continues to compare the characters until either the entire pattern has been matched or a mismatch occurs. If the entire pattern is matched, the algorithm reports a successful match. If a mismatch occurs, the algorithm uses the good suffix rule to determine how far to shift the pattern to the right.

The bad character rule works by looking at the last occurrence of the mismatched character in the pattern and shifting the pattern to align with that occurrence. The good suffix rule works by looking for a suffix of the pattern that matches a prefix of the mismatched substring, and shifting the pattern to align with that suffix. If no suffix of the pattern matches a prefix of the mismatched substring, the algorithm shifts the pattern by the length of the pattern.

## Running the Program

### Local

1. Install node.js and npm
2. Clone the repository
3. Navigate to the project directory and run `npm install` to install all dependencies
4. Run `npm run dev`
5. Visit the given localhost

### Website

1. Open this [link](https://simsimi-kyun-kyun.vercel.app)

## Libraries Used

- [NextAuth](https://next-auth.js.org/)
- [Prisma](https://www.prisma.io/)
- [Next](https://nextjs.org/)
- [Tanstack Query](https://tanstack.com/query/latest)
- [daisyUI](https://daisyui.com/)
- [tailwind](https://tailwindcss.com/)
