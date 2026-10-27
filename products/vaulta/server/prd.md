Requirements:

- User should be able to create 4 levels structure means
  user can create Folder with files or other level of Folders this continues in this cycle for 4 times.




Points to consider
  - We need to create a AWS S3 bucket ex: name "dm-core" in which this data of files & folders
  creatation & updation etc happens
  - But for testing purpose,(local) we can simple create a folder name "dm-core-storage" & store there
  - But we need to run a server in 2 different ways.
    - npm run dm-core-local
    - npm run dm-core-prod

  - But all the apis must be intact irrespective of the local or prod env just there storage will but should not impact how they are stored or retrieved.


`This level should be controlled be a single const variable, in case we want 5 levels in future it is simple.`

That sounds like you need a clear definition of a **four-level hierarchical structure**.

Here is a simplified explanation of how that structure would work, focusing on the ability to nest folders within folders, down to four distinct levels:

---

## Four-Level Hierarchical Structure

A four-level structure means you can organize your content—whether they are **Folders** or **Files**—in a system where any item can be placed into a container up to four layers deep.

Think of it like nested boxes or a family tree:

- **Level 1: The Root (Main Folder)**

  - This is the top container. It can hold **Files** or **Level 2 Folders**.
  - _Example: **Projects** folder._

- **Level 2: Subfolder**

  - This folder lives inside a Level 1 Folder. It can hold **Files** or **Level 3 Folders**.
  - _Example: **2025 Marketing Campaign** folder._

- **Level 3: Sub-Subfolder**

  - This folder lives inside a Level 2 Folder. It can hold **Files** or **Level 4 Folders**.
  - _Example: **Graphics & Assets** folder._

- **Level 4: The Deepest Level**
  - This folder lives inside a Level 3 Folder. It is the **final container** for other folders. It can only hold **Files**.
  - _Example: **Social Media Ads** folder._

### The Cycle Explained

The key is that at any point (Level 1, 2, or 3), the container can hold a **File** or another **Folder** (which then starts the next level of the cycle), but this nesting stops after the fourth folder level.

==========

- Folder

  - contains files

- File

  - We should support Documents,Pictures.

- Both File & Folders can have:

  - name
  - icon based on the file type
  - size
  - move to bin
  - can create a copy
  - rename
  - share
  - download
  - view information
  - add to stared
  - copy link

- Bin

  - once a file or folder or a folder with files on delete goes to Bin folder
  - Ever items present in the bin gets auto deleted after a specific period ex: 30 days

- Recent

  - latest modified/updated files show up under this list

- Help & Feedback
- Terms & Conditions
- Privacy Policy

- Need a update api for the same schema

- Generate a Postman collection, with test data
  Test cases
- only owner how uploaded a file or the creator of the file or folder can perform the actions

Spec

- /api/dm/upload
- /api/dm/create
  - file
  - folder
- /api/dm/search
- Search by name
