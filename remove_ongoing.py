with open('project.html', 'r', encoding='utf-16') as f:
    content = f.read()

# Find the start of Ongoing Projects section
start_idx = content.find('<!-- ONGOING PROJECTS SECTION -->')
if start_idx == -1:
    start_idx = content.find('Ongoing Projects\n              </p>')
    # Go back to find <section
    start_idx = content.rfind('<section', 0, start_idx)

print('Start index:', start_idx)
print('Snippet:', repr(content[start_idx:start_idx+100]))

# Find the end - look for the next section </section>
end_marker = '</section>\n\n      <section class="py-16 md:py-20'
end_idx = content.find(end_marker, start_idx)
print('End index:', end_idx)

if start_idx > 0 and end_idx > start_idx:
    section_to_remove = content[start_idx:end_idx+len('</section>')]
    print('Section length:', len(section_to_remove))
    # Remove it
    content = content[:start_idx] + content[end_idx+len('</section>'):]
    print('Removed!')

    with open('project.html', 'w', encoding='utf-16') as f:
        f.write(content)
    print('Saved!')
else:
    print('Could not find boundaries')