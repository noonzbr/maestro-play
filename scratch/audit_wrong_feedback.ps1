$games = Get-ChildItem -Path "lib/games" -Filter "game*.ts"

foreach ($game in $games) {
    $content = Get-Content -LiteralPath $game.FullName -Raw
    
    # We want to count:
    # 1. Total choices in the file (often inside "choices" array: { text: ..., isCorrect: false })
    # 2. Choices that have wrongFeedback
    # 3. Choices that have wrongStoryText
    
    $totalChoices = 0
    $wrongFeedbackCount = 0
    $wrongStoryTextCount = 0
    
    # A simple regex scan for choices blocks
    # Choices are usually represented by objects inside choices: [...] array
    # Let's count how many times we see "wrongFeedback:" or "wrongStoryText:"
    
    $feedbacks = [regex]::Matches($content, "wrongFeedback\s*:")
    $storyTexts = [regex]::Matches($content, "wrongStoryText\s*:")
    
    # Also find choices with isCorrect: false
    # Usually represented by: isCorrect: false, or correct: false
    $wrongChoices = [regex]::Matches($content, "isCorrect\s*:\s*false")
    
    Write-Host "$($game.Name):"
    Write-Host "  wrongFeedback occurrences: $($feedbacks.Count)"
    Write-Host "  wrongStoryText occurrences: $($storyTexts.Count)"
    Write-Host "  isCorrect: false occurrences: $($wrongChoices.Count)"
}
