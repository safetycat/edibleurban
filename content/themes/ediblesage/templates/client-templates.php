<script type="text/ng-template" id="map_popup">
<div class="popup-content">
    <h3>{{name}}</h3>
    <hr />
    <div>
        {{image ? "<img src='" : ""}} {{image}} {{image ? "'/>" : ""}}
        {{body}}
    </div>
    <hr />
    <div>
        <span class='category'>Area Type:</span> {{area_type}} <br />
        {{suggestedUses ? "<span class='category'>Suggested Uses:</span>" : ""}} {{suggestedUses}}
    </div>
</div>
</script>